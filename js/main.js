new Vue({
    el: '#app',
    data: {
        cards: [],
        nextId: 1,
        showModal: false,
        targetColumn: 1,
        newCard: {
            title: '',
            items: [
                { text: '' },
                { text: '' },
                { text: '' }
            ]
        }
    },

    computed: {
        column1Cards() {
            return this.cards.filter(card => card.column === 1);
        },
        column2Cards() {
            return this.cards.filter(card => card.column === 2);
        },
        column3Cards() {
            return this.cards.filter(card => card.column === 3);
        }
    },

    methods: {
        openModal(column) {
            this.targetColumn = column;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.newCard = {
                title: '',
                items: [
                    { text: '' },
                    { text: '' },
                    { text: '' }
                ]
            }
        },
        addItem() {
            if (this.newCard.items.length < 5) {
                this.newCard.items.push({ text: '' });
            }
        },
        removeItem() {
            if (this.newCard.items.length > 3) {
                this.newCard.items.pop();
            }
        },

        createCard() {
            if (!this.newCard.title.trim()) {
                alert('Введите заголовок');
                return;
            }

            const validItems = this.newCard.items.filter(item => item.text.trim());
            if (validItems.length < 3) {
                alert('Минимум 3 заполненных пункта');
                return;
            }

            const card = {
                id: this.nextId++,
                title: this.newCard.title,
                items: validItems.map(item => ({
                    text: item.text,
                    completed: false
                })),
                column: this.targetColumn,
                progress: 0,
                completed: null
            }

            this.cards.push(card);
            this.closeModal();
        },

        updateProgress(card) {
            const completedCount = card.items.filter(item => item.completed).length;
            const totalCount = card.items.length;
            const progress = Math.round((completedCount / totalCount) * 100);
            card.progress = progress;

            if (card.column === 1) {
                if (progress > 50 && progress < 100) {
                    card.column = 2;
                } else if (progress === 100) {
                    card.column = 3;
                    card.completed = new Date().toLocaleString();
                }
            } else if (card.column === 2 && progress === 100) {
                card.column = 3;
                card.completed = new Date().toLocaleString();
            }
        }
    },



})