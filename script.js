const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const UrlPoster = 'https://image.tmdb.org/t/p/w500/';

function apiSearch(event) {
	event.preventDefault();
	const searchText = document.querySelector('.form-control').value;
	if (searchText.trim().length === 0) {
		movie.innerHTML = '<h2 class="col-12 text-center text-danger bg-color ">Поле поиска не должно быть пустым!</h2>';
		return;
	}

	movie.innerHTML = '<div class="spinner"></div>';

	fetch(`https://api.themoviedb.org/3/search/multi?api_key=bb35183f45cf8b9b332040f3d4680726&language=ru&query=${searchText}`)
		.then(function (value) {
			if (value.status !== 200) {
				return Promise.reject(value);
			}
			return value.json();
		})
		.then(function (output) {
			let inner = '';
			if (output.results.length === 0) {
				inner = '<h2 class="col-12 text-center text-info bg-color ">Фильмов по Вашему запросу не найдено :(</h2>';
			}
			output.results.forEach(function (item) {
				let nameItem = item.name || item.title;

				let overview = item.overview || 'Описание отсутствует';
				let date = item.first_air_date || item.release_date;
				const posterUrl = './Out_Of_Poster.jpg';
				const poster = item.poster_path ? UrlPoster + item.poster_path : './Out_Of_Poster.jpg';
				let dataInfo = '';
				if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;


				inner +=
					`<div class="card-deck col-12 col-md-6 col-lg-4">
						<div class="card mb-3" ${dataInfo}>
							<img src="${poster}" class="card-img-top img_poster" alt="${nameItem}">
							<div class="card-body">
								<h5 class="card-title text-center">${nameItem}</h5>
							</div>
							<div class="card-footer text-center">
								<small class="text-muted">Дата выхода: ${date}</small>
							</div>
						</div>
					</div>`
				// console.log(output);
			});

			movie.innerHTML = inner;

			addEventMedia();

		})
		.catch(function (reason) {
			movie.innerHTML = 'Упс, что-то пошло не так!';
			console.error('Error: ' + reason.status);
		});

}

searchForm.addEventListener('submit', apiSearch);

function addEventMedia() {
	const media = movie.querySelectorAll('.card[data-id]');
	media.forEach(function (elem) {
		elem.style.cursor = 'pointer';
		elem.addEventListener('click', showFullInfo);
	});
}

function getTimeFromMins(mins) {
	let hours = Math.trunc(mins / 60);
	let minutes = mins % 60;
	if( hours === 0) {
	return minutes + ' мин';
	} else {
		return hours + ' ч ' + minutes + ' мин';
	}
};

function showFullInfo() {
	let url = '';
	if (this.dataset.type === 'movie') {
		url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=bb35183f45cf8b9b332040f3d4680726&language=ru';
	} else if (this.dataset.type === 'tv') {
		url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=bb35183f45cf8b9b332040f3d4680726&language=ru';
	} else {
		movie.innerHTML = '<h2 class="col-12 text-center text-danger bg-color ">Произошла ошибка, повторите позже...</h2>';
	}

	fetch(url)
		.then(function (value) {
			if (value.status !== 200) {
				return Promise.reject(value);
			}
			return value.json();
		})
		.then(function (output) {
			// console.log(output);
			let genres = '';
			output.genres.forEach(function (item) {
				genres += `<span class="genres">${item.name}</span>`
			});

			movie.innerHTML = `
			
			<div class="col-12 col-lg-5 mb-5 text-center pl-0">
				<img src="${UrlPoster + output.poster_path}" alt="${output.name || output.title}" class="shadow rounded">
			</div>
			<div class="col-lg-7 shadow mb-5 bg-color">
				<h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
				${(output.vote_average) ? `<p>Рейтинг: ${output.vote_average}</p>` : ''}
				${(output.tagline) ? `<p>Слоган: ${output.tagline}</p>` : ''}
				${(genres) ? `<p>Жанр: ${genres}</p>` : ''}
				${(output.number_of_seasons) ? `<p>Сезонов: ${output.number_of_seasons}</p>` : ''}
				${(output.number_of_episodes) ? `<p>Серий: ${output.number_of_episodes}</p>` : ''}
				${(output.runtime) ? `<p>Длительность: ${getTimeFromMins(output.runtime)}</p>` : ''}
				${(output.budget) ? `<p>Бюджет: ${output.budget} $</p>` : ''}
				${(output.overview) ? `<p>Описание: ${output.overview}</p>` : ''}
				${(output.homepage) ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Официальная страница - "${output.name || output.title}"</a></p>` : ''}
				${(output.imdb_id) ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.com</a></p>` : ''}
				<p class="text-center"><a href="index.html">На главную</a></p>
			</div>
			`;
		})
		.catch(function (reason) {
			movie.innerHTML = 'Упс, что-то пошло не так!';
			console.error('Error: ' + reason.status);
		});
}

document.addEventListener('DOMContentLoaded', function () {
	fetch('https://api.themoviedb.org/3/trending/all/week?api_key=bb35183f45cf8b9b332040f3d4680726&language=ru')
		.then(function (value) {
			if (value.status !== 200) {
				return Promise.reject(value);
			}
			return value.json();
		})
		.then(function (output) {
			let inner = '<h4 class="col-12 text-center text-info mb-5 bg-color ">Популярное за неделю:</h4>';
			if (output.results.length === 0) {
				inner = '<h2 class="col-12 text-center text-info">Фильмов по Вашему запросу не найдено :(</h2>';
			}
			output.results.forEach(function (item) {
				let nameItem = item.name || item.title;
				let mediaType = item.title ? 'movie' : 'tv';
				const UrlPoster = 'https://image.tmdb.org/t/p/w500/';
				let overview = item.overview || 'Описание отсутствует';
				let date = item.first_air_date || item.release_date;
				const posterUrl = './Out_Of_Poster.jpg';
				const poster = item.poster_path ? UrlPoster + item.poster_path : './Out_Of_Poster.jpg';
				dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
				inner +=
					`<div class="card-deck col-12 col-md-6 col-lg-4">
						<div class="card mb-3 shadow" ${dataInfo}>
							<img src="${poster}" class="card-img-top img_poster" alt="${nameItem}">
							<div class="card-body">
								<h5 class="card-title text-center">${nameItem}</h5>
							</div>
							<div class="card-footer text-center">
								<small class="text-muted">Дата выхода: ${date}</small>
							</div>
						</div>
					</div>`
				// console.log(output);
			});

			movie.innerHTML = inner;

			addEventMedia();

		})
		.catch(function (reason) {
			movie.innerHTML = 'Упс, что-то пошло не так!';
			console.error('Error: ' + reason.status);
		});
});
