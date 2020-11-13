/* eslint-disable no-unused-vars */

// Создаем переменную, в которую положим кнопку меню
// let menuToggle = document.querySelector('#menu-toggle')
// let menu = document.querySelector('.sidebar')
// menuToggle.addEventListener('click', function (event) {
// 	event.preventDefault()
// 	menu.classList.toggle('visible')
// })

const regExpValidEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const loginElem = document.querySelector('.login')
const loginForm = document.querySelector('.login-form')
const emailInput = document.querySelector('.login-form__email')
const passwordInput = document.querySelector('.login-form__password')
const loginSignup = document.querySelector('.login-form__signup')
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

const listUser = [
	{
		id: '01',
		email: 'sergei@gmail.com',
		password: '12345',
		displayName: 'SergeiJS',
	},
	{
		id: '02',
		email: 'stef@gmail.com',
		password: '67890',
		displayName: 'Stefany',
	},
]

const setUsers = {
	user: null,

	logIn(email, password, handler) {
		if (!regExpValidEmail.test(email)) return alert('Email не валиден')

		const user = this.getUser(email)
		if (user && user.password === password) {
			this.authorizedUser(user)
			handler()
		} else {
			alert('Пользователь с такими данными не найден!')
		}
	},

	logOut(handler) {
		this.user = null
		handler()
	},

	signUp(email, password, handler) {
		if (!regExpValidEmail.test(email)) return alert('Email не валиден')

		if (!email.trim() || !password.trim()) {
			alert('Введите данные!')
			return
		}

		if (!this.getUser(email)) {
			const user = {
				email,
				password,
				displayName: email.slice(0, email.indexOf('@')),
			}

			listUser.push(user)
			this.authorizedUser(user)
			handler()
		} else {
			alert('пользователь существует')
		}
	},

	editUser(userName, userPhoto = '', handler) {
		if (userName) {
			this.user.displayName = userName
		}

		if (userPhoto) {
			this.user.photo = userPhoto
		}

		handler()
	},

	getUser(email) {
		return listUser.find(item => item.email === email)
	},

	authorizedUser(user) {
		this.user = user
	},
}

const setPosts = {
	allPosts: [
		{
			title: 'Заголовок поста с интригой',
			text: `Таким образом укрепление и развитие структуры требуют от нас
						анализа форм развития. Не следует, однако забывать, что реализация
						намеченных плановых заданий требуют от нас анализа позиций,
						занимаемых участниками в отношении поставленных задач. Задача
						организации, в особенности же консультация с широким активом
						способствует подготовки и реализации новых предложений. Равным
						образом новая модель организационной деятельности позволяет
						оценить значение модели развития.
						<br />
						<br />
						Таким образом начало повседневной работы по формированию позиции
						позволяет выполнять важные задания по разработке существенных
						финансовых и административных условий. Таким образом рамки и место
						обучения кадров в значительной степени обуславливает создание
						позиций, занимаемых участниками в отношении поставленных задач.
						<br />
						<br />
						Повседневная практика показывает, что дальнейшее развитие
						различных форм деятельности представляет собой интересный
						эксперимент проверки форм развития. Товарищи! новая модель
						организационной деятельности требуют определения и уточнения форм
						развития. Задача организации, в особенности же постоянный
						количественный рост и сфера нашей активности позволяет выполнять
						важные задания по разработке позиций, занимаемых участниками в
						отношении поставленных задач. Повседневная практика показывает,
						что дальнейшее развитие различных форм деятельности требуют
						определения и уточнения соответствующий условий активизации.`,
			tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
			author: {
				displayName: 'Sasha',
				photo:
					'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQxLc3AqP7pqq7vVYhM0upTIWK97kwLfwY5GA&usqp=CAU',
			},
			date: '10.10.2020, 09:55:00',
			like: 15,
			comments: 20,
		},
		{
			title: 'Заголовок поста с интригой #2',
			text: `Таким образом укрепление и развитие структуры требуют от нас
						анализа форм развития. Не следует, однако забывать, что реализация
						намеченных плановых заданий требуют от нас анализа позиций,
						занимаемых участниками в отношении поставленных задач. Задача
						организации, в особенности же консультация с широким активом
						способствует подготовки и реализации новых предложений. Равным
						образом новая модель организационной деятельности позволяет
						оценить значение модели развития.
						<br />
						<br />
						Таким образом начало повседневной работы по формированию позиции
						позволяет выполнять важные задания по разработке существенных
						финансовых и административных условий. Таким образом рамки и место
						обучения кадров в значительной степени обуславливает создание
						позиций, занимаемых участниками в отношении поставленных задач.
						<br />
						<br />
						Повседневная практика показывает, что дальнейшее развитие
						различных форм деятельности представляет собой интересный
						эксперимент проверки форм развития. Товарищи! новая модель
						организационной деятельности требуют определения и уточнения форм
						развития. Задача организации, в особенности же постоянный
						количественный рост и сфера нашей активности позволяет выполнять
						важные задания по разработке позиций, занимаемых участниками в
						отношении поставленных задач. Повседневная практика показывает,
						что дальнейшее развитие различных форм деятельности требуют
						определения и уточнения соответствующий условий активизации.`,
			tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
			author: {
				displayName: 'Mary',
				photo:
					'https://cs8.pikabu.ru/post_img/2017/01/28/10/1485626384190086634.jpg',
			},
			date: '10.11.2020, 08:35:00',
			like: 45,
			comments: 55,
		},
	],
}

const toggleAuthDom = () => {
	const user = setUsers.user

	console.log('user: ', user)

	if (user) {
		loginElem.style.display = 'none'
		userElem.style.display = ''
		userNameElem.textContent = user.displayName
		userAvatarElem.src = user.photo || userAvatarElem.src
	} else {
		loginElem.style.display = ''
		userElem.style.display = 'none'
	}
}

const showAllPosts = () => {
	let postHTML = ``

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
									? `<img src="${author.photo}" />`
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
		setUsers.logOut(toggleAuthDom)
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

	showAllPosts()
	toggleAuthDom()
}

document.addEventListener('DOMContentLoaded', () => {
	init()
})
