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
        'articleFilter':'',
        ArticleListFiltered(){
            
            return this.articleFilter ? this.ArticleList.filter(a => a.value.toLowerCase().indexOf(this.articleFilter.toLowerCase())> -1 ) : this.ArticleList
        },
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
        'loggedInUser': '',
        'loginExpiresOn': '',

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
        init() {
            this.getArticles(() =>
                this.getShoppingList(() => {
                    this.showShoppingList()
                    this.getUserInfo()
                }
                ))
        }, // init()
        getUserInfo() {
            try {
                const token = localStorage.getItem("_lda_token")
                const parts = token.split(/\./)
                if (parts.length > 1) {
                    const decoded = atob(parts[1])
                    var userObject = JSON.parse(decoded)
                    this.loggedInUser = userObject.userName
                    this.loginExpiresOn = new Date(userObject.exp * 1000).toISOString().replace(/[TZ]/g, ' ').substring(0, 19)

                }
            } catch (error) {

            }

        }, // getUserInfo()
        login() {
            this.loaderVisible = true
            this.LDA.authenticate(this.username, this.password, this.expireInDays,
                (json) => {
                    localStorage.setItem("_lda_token", json.message)
                    this.loginOpen = false
                    this.getUserInfo()
                    this.getArticles(() => this.getShoppingList(() => this.showShoppingList()))

                }, // OK
                (json) => {
                    this.errors = json.errors
                }, // Error
                () => { this.loaderVisible = false } // Finally
            )

        }, // /login()
        logout(){
            localStorage.removeItem("_lda_token");
            document.location = document.location.toString()
        },
        sortByValue(a, b) {
            if ( a.value < b.value ){
                return -1;
              }
              if ( a.value > b.value ){
                return 1;
              }
              return 0;
        },
        getArticles(callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }
            else {
                this.LDA.getStrings('ArticleList', token,
                    (json) => {
                        this.ArticleList = json.data.sort(this.sortByValue)
                        if (callback) {
                            callback()
                        }
                    }, // OK
                    (json) => {
                        this.errors = json.errors
                        this.showLogin()
                    }, // not authenticated
                    (json) => { this.errors = json.errors }, // Error
                    () => { this.loaderVisible = false }, // Finally

                )
            }

        }, // /getArticles()

        addArticle(callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }

            else {
                this.LDA.postStrings('ArticleList', token, [this.articleToAdd],
                    (json) => {
                        this.ArticleList = json.data
                        this.articleToAdd = ''
                        if (callback) {
                            callback()
                        }
                    }, // OK
                    (json) => {
                        this.errors = json.errors
                        this.showLogin()
                    }, // not authenticated
                    (json) => { this.errors = json.errors }, // Error
                    () => { this.loaderVisible = false }, // Finally

                )
            }
        }, // /addArticle()        
        updateArticle(article, callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }
            else {
                this.LDA.putStrings(article.id, token, article.value,
                    (json) => {
                        this.ArticleList = json.data
                        if (callback) {
                            callback()
                        }
                    }, // OK
                    (json) => {
                        this.errors = json.errors
                        this.showLogin()
                    }, // not authenticated
                    (json) => { this.errors = json.errors }, // Error
                    () => { this.loaderVisible = false }, // Finally

                )
            }

        }, // /updateArticle()

        deleteArticle(art, callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }
            else {
                this.LDA.deleteStringById(art.id, token,
                    (json) => {
                        this.ArticleList = json.data
                        if (callback) {
                            callback()
                        }
                    }, // OK
                    (json) => {
                        this.errors = json.errors
                        this.showLogin()
                    }, // not authenticated
                    (json) => { this.errors = json.errors }, // Error
                    () => { this.loaderVisible = false }, // Finally

                )

            }
        }, // /deleteArticle()

        getShoppingList(callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }
            else {
                this.LDA.getStrings('ShoppingList', token,
                    (json) => {
                        this.ShoppingList = json.data
                        if (callback) {
                            callback()
                        }
                    }, // OK
                    (json) => {
                        this.errors = json.errors
                        this.showLogin()
                    }, // not authenticated
                    (json) => { this.errors = json.errors }, // Error
                    () => { this.loaderVisible = false }, // Finally

                )
            }
        }, // /getShoppingList()
        addToShoppingList(callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }
            else {
                var ats = [this.articleToShop]
                if(ats[0].indexOf('\n')>-1){
                    ats = ats[0].split('\n')
                }
                ats = ats.map(a => a.trim().replace(/ {2,}/gi,' ').replace(/\t/gi,''))
                this.LDA.postStrings('ShoppingList', token, ats,
                    (json) => {
                        this.ShoppingList = json.data
                        this.articleToShop = ''
                        if (callback) {
                            callback()
                        }
                    }, // OK
                    (json) => {
                        this.errors = json.errors
                        this.showLogin()
                    }, // not authenticated
                    (json) => { this.errors = json.errors }, // Error
                    () => { this.loaderVisible = false }, // Finally

                )
            }

        }, // /addToShoppingList()
        updateShoppingArticle(article, callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }
            else {
                this.LDA.putStrings(article.id, token, article.value,
                    (json) => {
                        this.ShoppingList = json.data
                        if (callback) {
                            callback()
                        }
                    }, // OK
                    (json) => {
                        this.errors = json.errors
                        this.showLogin()
                    }, // not authenticated
                    (json) => { this.errors = json.errors }, // Error
                    () => { this.loaderVisible = false }, // Finally

                )
            }

        }, // /updateShoppingArticle()
        deleteFromShoppingList(id, callback) {
            this.loaderVisible = true
            const token = localStorage.getItem("_lda_token")
            if (!token) {
                this.showLogin()
            }
            else {
                this.LDA.deleteStringById(id, token,
                    (json) => {
                        this.ShoppingList = json.data
                        if (callback) {
                            callback()
                        }
                    }, // OK
                    (json) => {
                        this.errors = json.errors
                        this.showLogin()
                    }, // not authenticated
                    (json) => { this.errors = json.errors }, // Error
                    () => { this.loaderVisible = false }, // Finally

                )
            }

        }, // /deleteFromShoppingList()

    }
}