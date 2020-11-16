/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// Создаем переменную, в которую положим кнопку меню
// let menuToggle = document.querySelector('#menu-toggle')
// let menu = document.querySelector('.sidebar')
// menuToggle.addEventListener('click', function (event) {
// 	event.preventDefault()
// 	menu.classList.toggle('visible')
// })

const firebaseConfig = {
	apiKey: 'AIzaSyCW8XtwXN8iZ-fQQW4LckOGvyKKLwCd72o',
	authDomain: 'pikadu-only.firebaseapp.com',
	databaseURL: 'https://pikadu-only.firebaseio.com',
	projectId: 'pikadu-only',
	storageBucket: 'pikadu-only.appspot.com',
	messagingSenderId: '558065563938',
	appId: '1:558065563938:web:066096f618145fa5b80d7b',
}

firebase.initializeApp(firebaseConfig)

console.log(firebase)

const regExpValidEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const loginElem = document.querySelector('.login')
const loginForm = document.querySelector('.login-form')
const emailInput = document.querySelector('.login-form__email')
const passwordInput = document.querySelector('.login-form__password')
const loginSignup = document.querySelector('.login-form__signup')
const loginFormForget = document.querySelector('.login-form__forget')
const userElem = document.querySelector('.user')
const userNameElem = document.querySelector('.user-account__name')
const userNavElem = document.querySelector('.user-actions')
const userAvatarElem = document.querySelector('.user-account__avatar')
const exitElem = document.querySelector('.user-off')
const editElem = document.querySelector('.user-edit')
const editContainer = document.querySelector('.user-editor')
const editUsername = document.querySelector('.editor-username')
const editPhotoURL = document.querySelector('.editor-photo')
const postsWrapper = document.querySelector('.posts')
const sidebarButtons = document.querySelector('.sidebar-buttons')
const createWrapper = document.querySelector('.create')
const createFormElem = document.querySelector('.create-form')

const DEFAULT_PHOTO = userAvatarElem.src

const setUsers = {
	user: null,

	initUser(handler) {
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.user = user
			} else {
				this.user = null
			}

			if (handler) handler()
		})
	},

	logIn(email, password, handler) {
		if (!regExpValidEmail.test(email)) {
			alert('Email не валиден')
			return
		}

		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.catch(err => {
				const errCode = err.code
				const errMessage = err.message

				if (errCode === 'auth/wrong-password') {
					alert('Неверный пароль')
				} else if (errCode === 'auth/user-not-found') {
					alert('Пользователь не найден')
				} else {
					alert(errMessage)
				}

				console.error(err)
			})

		// const user = this.getUser(email)
		// if (user && user.password === password) {
		// 	this.authorizedUser(user)

		// 	if (handler) handler()
		// } else {
		// 	alert('Пользователь с такими данными не найден!')
		// }
	},

	logOut() {
		firebase.auth().signOut()
	},

	signUp(email, password, handler) {
		if (!regExpValidEmail.test(email)) return alert('Email не валиден')

		if (!email.trim() || !password.trim()) {
			alert('Введите данные!')
			return
		}

		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(data => {
				this.editUser(email.slice(0, email.indexOf('@')), null, handler)
			})
			.catch(err => {
				const errCode = err.code
				const errMessage = err.message

				if (errCode === 'auth/week-password') {
					alert('Слабый пароль')
				} else if (errCode === 'auth/email-already-in-use') {
					alert('Этот Email уже используется')
				} else {
					alert(errMessage)
				}

				console.error(err)
			})

		// if (!this.getUser(email)) {
		// 	const user = {
		// 		email,
		// 		password,
		// 		displayName: email.slice(0, email.indexOf('@')),
		// 	}

		// 	listUser.push(user)
		// 	this.authorizedUser(user)

		// 	if (handler) handler()
		// } else {
		// 	alert('пользователь существует')
		// }
	},

	editUser(displayName, photoURL, handler) {
		const user = firebase.auth().currentUser

		if (displayName) {
			if (photoURL) {
				user
					.updateProfile({
						displayName,
						photoURL,
					})
					.then(handler)
			} else {
				user
					.updateProfile({
						displayName,
					})
					.then(handler)
			}
		}
	},

	// getUser(email) {
	// 	return listUser.find(item => item.email === email)
	// },

	// authorizedUser(user) {
	// 	this.user = user
	// },

	sendForget(email) {
		firebase
			.auth()
			.sendPasswordResetEmail(email)
			.then(() => alert('Письмо отправлено вам на почту'))
			.catch(err => console.error(err))
	},
}

loginFormForget.addEventListener('click', event => {
	event.preventDefault()

	setUsers.sendForget(emailInput.value)
	emailInput.value = ''
})

const setPosts = {
	allPosts: [],

	addPost(title, text, tags, handler) {
		const user = firebase.auth().currentUser

		this.allPosts.unshift({
			id: `postID${(+new Date()).toString(16)}-${user.uid}`,
			title,
			text,
			tags: tags.split(',').map(item => item.trim()),
			author: {
				displayName: setUsers.user.displayName,
				photo: setUsers.user.photoURL,
			},
			date: new Date().toLocaleString(),
			like: 0,
			comments: 0,
		})

		firebase
			.database()
			.ref('post')
			.set(this.allPosts)
			.then(() => this.getPosts(handler))
			.then()
	},

	getPosts(handler) {
		firebase
			.database()
			.ref('post')
			.on('value', snapshot => {
				this.allPosts = snapshot.val() || []
				handler()
			})
	},
}

const toggleAuthDom = () => {
	const user = setUsers.user

	console.log('user: ', user)

	if (user) {
		loginElem.style.display = 'none'
		userElem.style.display = ''
		userNameElem.textContent = user.displayName
		userAvatarElem.src = user.photoURL || DEFAULT_PHOTO
		sidebarButtons.classList.add('visible')
	} else {
		loginElem.style.display = ''
		userElem.style.display = 'none'
		sidebarButtons.classList.remove('visible')
		createWrapper.classList.remove('visible')
		postsWrapper.classList.add('visible')
	}
}

const showCreatePostForm = () => {
	createWrapper.classList.add('visible')
	postsWrapper.classList.remove('visible')
}

const showAllPosts = () => {
	let postHTML = ''

	setPosts.allPosts.forEach(
		({ title, text, tags, like, comments, author, date }) => {
			postHTML += `
				<section class="post">
					<div class="post-article">
						<h2 class="post-title">${title}</h2>
						<p class="post-text">${text}</p>
						<ul class="post-tags">
							${tags
								.map(
									tag =>
										`<li class="post-tags__tag"><a href="/${tag}">#${tag}</a></li>`
								)
								.join('')}
						</ul>
					</div>
					<div class="post-footer">
						<div class="post-actions">
							<button class="post-button likes">
								<svg class="icon">
									<use xlink:href="./assets/svg/icons.svg#like"></use>
								</svg>
								<span class="post-button__counter likes-counter">${like}</span>
							</button>
							<button class="post-button comments">
								<svg class="icon">
									<use xlink:href="./assets/svg/icons.svg#comment"></use>
								</svg>
								<span class="post-button__counter comments-counter">${comments}</span>
							</button>
							<button class="post-button save">
								<svg class="icon">
									<use xlink:href="./assets/svg/icons.svg#save"></use>
								</svg>
							</button>
							<button class="post-button share">
								<svg class="icon">
									<use xlink:href="./assets/svg/icons.svg#share"></use>
								</svg>
							</button>
						</div>
						<div class="post-author author">
							<div class="author-about">
								<span class="author-name"><a href="#">${author.displayName}</a></span>
								<span class="author-time">${date}</span>
							</div>
							<a href="#" class="author-photo">
								${
									author.photo
										? `<img class="icon" src="${author.photo}" />`
										: `<svg class="icon"><use xlink:href="./assets/svg/icons.svg#user"></use></svg>`
								}
							</a>
						</div>
					</div>
				</section>
			`
		}
	)

	postsWrapper.innerHTML = postHTML

	createWrapper.classList.remove('visible')
	postsWrapper.classList.add('visible')
}

const init = () => {
	loginForm.addEventListener('submit', event => {
		event.preventDefault()

		const emailValue = emailInput.value
		const passwordValue = passwordInput.value

		setUsers.logIn(emailValue, passwordValue, toggleAuthDom)
		loginForm.reset()
	})

	loginSignup.addEventListener('click', event => {
		event.preventDefault()

		const emailValue = emailInput.value
		const passwordValue = passwordInput.value

		setUsers.signUp(emailValue, passwordValue, toggleAuthDom)
		loginForm.reset()
	})

	exitElem.addEventListener('click', event => {
		event.preventDefault()
		setUsers.logOut()
	})

	editElem.addEventListener('click', event => {
		event.preventDefault()

		editContainer.classList.toggle('visible')

		editContainer.classList.contains('visible')
			? userNavElem.classList.add('hide')
			: userNavElem.classList.remove('hide')

		editUsername.value = setUsers.user.displayName
	})

	editContainer.addEventListener('submit', event => {
		event.preventDefault()

		setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom)
		editContainer.classList.remove('visible')
		userNavElem.classList.remove('hide')
	})

	sidebarButtons.addEventListener('click', event => {
		event.preventDefault()

		if (event.target.classList.contains('sidebar-buttons__btn--publish')) {
			showCreatePostForm()
		}
	})

	createFormElem.addEventListener('submit', event => {
		event.preventDefault()

		const { title, text, tags } = createFormElem.elements

		if (title.value.length < 6) {
			alert('Слишком короткий заголовок')
			return
		}

		if (text.value.length < 50) {
			alert('Слишком короткий пост')
			return
		}

		setPosts.addPost(title.value, text.value, tags.value, showAllPosts)

		createWrapper.classList.remove('visible')
		createFormElem.reset()
	})

	setUsers.initUser(toggleAuthDom)
	setPosts.getPosts(showAllPosts)
}

document.addEventListener('DOMContentLoaded', () => {
	init()
})
