window.App = () => {
    return {
        'LDA': window.LDA,
        'menuOpen': false,
        'artListOpen': false,
        'shopListOpen': false,
        'loginOpen': false,
        'loaderVisible': false,

        'ArticleList': [
            { "id": 1, "value": "Article 1" },
            { "id": 2, "value": "Article 2" },
            { "id": 3, "value": "Article 3" },
        ],
        'ShoppingList': [
            { "id": 45, "value": "Article A" },
            { "id": 99, "value": "Article B" },
            { "id": 121, "value": "Article C" },
        ],
        articleToAdd: '',
        articleToShop: '',

        'username': '',
        'password': '',
        'expireInDays': 1,
        'errors': '',

        showLogin(hide) {
            this.shopListOpen = false
            this.artListOpen = false
            this.loginOpen = hide ? false : true
            this.menuOpen = false
            this.loaderVisible = false
        },
        showArticles(hide) {
            this.shopListOpen = false
            this.artListOpen = hide ? false : true
            this.loginOpen = false
            this.menuOpen = false
        },
        showShoppingList(hide) {
            this.shopListOpen = hide ? false : true
            this.artListOpen = false
            this.loginOpen = false
            this.menuOpen = false
        },
        getUserInfo() {
            try {
                const token = localStorage.getItem("_lda_token")
                const parts = token.split(/\./)
                if (parts.length > 1) {
                    const decoded = atob(parts[1])
                    var userObject = JSON.parse(decoded)
                    return {
                        userName : userObject.userName,
                        expiryDate: new Date(userObject.exp*1000).toISOString().replace(/[TZ]/g,' ').substring(0,19)
                    }
                }
            } catch (error) {
                
            }

            return {
                userName : '',
                expiryDate: ''
            }

        },
        login() {
            this.loaderVisible = true
            this.LDA.authenticate(this.username, this.password, this.expireInDays,
                (json) => {
                    localStorage.setItem("_lda_token", json.message)
                    this.loginOpen = false
                    this.getArticles()
                    this.getShoppingList()
                },
                (json) => {
                    this.errors = json.errors
                },
                () => { this.loaderVisible = false }
            )

        }, // /login()

        init() {
            this.getArticles(() => this.getShoppingList(() => this.showShoppingList()))
        },

        getArticles(callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }

            this.LDA.getStrings('ArticleList', token,
                (json) => {
                    this.ArticleList = json.data
                    if (callback) {
                        callback()
                    }
                }, // OK
                (json) => {
                    this.errors = json.errors
                    this.showLogin()
                }, // Error
                () => { this.loaderVisible = false }, // Finally

            )
        }, // /getArticles()

        addArticle(callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                showLogin()
            }


            this.LDA.postStrings('ArticleList', token, [this.articleToAdd],
                (json) => {
                    this.ArticleList = json.data
                    this.articleToAdd = ''
                    if (callback) {
                        callback()
                    }
                }, // OK
                (json) => { this.errors = json.errors }, // Error
                () => { this.loaderVisible = false }, // Finally

            )
        }, // /addArticle()        
        updateArticle(article, callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                showLogin()
            }


            this.LDA.putStrings(article.id, token, article.value,
                (json) => {
                    this.ArticleList = json.data
                    if (callback) {
                        callback()
                    }
                }, // OK
                (json) => { this.errors = json.errors }, // Error
                () => { this.loaderVisible = false }, // Finally

            )
        }, // /updateArticle()

        deleteArticle(art, callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                showLogin()
            }


            this.LDA.deleteStringById(art.id, token,
                (json) => {
                    this.ArticleList = json.data
                    if (callback) {
                        callback()
                    }
                }, // OK
                (json) => { this.errors = json.errors }, // Error
                () => { this.loaderVisible = false }, // Finally

            )
        }, // /deleteArticle()

        getShoppingList(callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                showLogin()
            }

            this.LDA.getStrings('ShoppingList', token,
                (json) => {
                    this.ShoppingList = json.data
                    if (callback) {
                        callback()
                    }
                }, // OK
                (json) => { this.errors = json.errors }, // Error
                () => { this.loaderVisible = false }, // Finally

            )
        }, // /getShoppingList()
        addToShoppingList(callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                showLogin()
            }


            this.LDA.postStrings('ShoppingList', token, [this.articleToShop],
                (json) => {
                    this.ShoppingList = json.data
                    this.articleToShop = ''
                    if (callback) {
                        callback()
                    }
                }, // OK
                (json) => { this.errors = json.errors }, // Error
                () => { this.loaderVisible = false }, // Finally

            )
        }, // /addToShoppingList()
        updateShoppingArticle(article, callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                showLogin()
            }


            this.LDA.putStrings(article.id, token, article.value,
                (json) => {
                    this.ShoppingList = json.data
                    if (callback) {
                        callback()
                    }
                }, // OK
                (json) => { this.errors = json.errors }, // Error
                () => { this.loaderVisible = false }, // Finally

            )
        }, // /updateShoppingArticle()
        deleteFromShoppingList(id, callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                showLogin()
            }


            this.LDA.deleteStringById(id, token,
                (json) => {
                    this.ShoppingList = json.data
                    if (callback) {
                        callback()
                    }
                }, // OK
                (json) => { this.errors = json.errors }, // Error
                () => { this.loaderVisible = false }, // Finally

            )
        }, // /deleteFromShoppingList()



    }
}