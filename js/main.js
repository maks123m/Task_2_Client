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
        },

        isColumn1Blocked() {
            const column2Full = this.column2Cards.length >= 5;
            const hasCardAbove50InColumn1 = this.column1Cards.some(card => card.progress > 50 && card.progress < 100);
            return column2Full && hasCardAbove50InColumn1;
        }
    },

    methods: {
        openModal(column) {
            if (column === 1 && this.column1Cards.length >= 3) {
                alert('Здесь нельзя больше трех карточек');
                return;
            }
            if (column === 2 && this.column2Cards.length >= 5) {
                alert('Здесь нельзя больше пяти карточек');
                return;
            }

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

            if (this.targetColumn === 1 && this.column1Cards.length >= 3) {
                alert('В первой колонке максимум 3 карточки');
                this.closeModal();
                return;
            }
            if (this.targetColumn === 2 && this.column2Cards.length >= 5) {
                alert('Во второй колонке максимум 5 карточек');
                this.closeModal();
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
            this.saveToStorage();
            this.closeModal();
        },

        checkPendingMoves() {
            const pendingCards = this.column1Cards.filter(card => card.progress > 50 && card.progress < 100);
            pendingCards.forEach(card => {
                if (this.column2Cards.length < 5) {
                    card.column = 2;
                }
            });
            this.saveToStorage();
        },

        updateProgress(card) {
            const completedCount = card.items.filter(item => item.completed).length;
            const totalCount = card.items.length;
            const progress = Math.round((completedCount / totalCount) * 100);
            card.progress = progress;

            if (card.column === 1) {
                if (progress > 50 && progress < 100) {
                    if (this.column2Cards.length < 5) {
                        card.column = 2;
                    }
                } else if (progress === 100) {
                    card.column = 3;
                    card.completed = new Date().toLocaleString();
                }
            } else if (card.column === 2 && progress === 100) {
                card.column = 3;
                card.completed = new Date().toLocaleString();
                this.checkPendingMoves();
            }
            this.saveToStorage();
        },
        saveToStorage() {
            sessionStorage.setItem('notes_app', JSON.stringify({
                cards: this.cards,
                nextId: this.nextId
            }));
        },

        loadFromStorage() {
            const saved = sessionStorage.getItem('notes_app');
            if (saved) {
                const data = JSON.parse(saved);
                this.cards = data.cards || [];
                this.nextId = data.nextId || 1;
            }
        },
    },

    mounted() {
        this.loadFromStorage();
    }



})