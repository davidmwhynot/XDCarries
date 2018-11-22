/*

	title: gulpfile.js
	desc: Gulp task definitions
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: TODO
	Created: 11/12/18
	Updated: 11/12/18

*/


/* XXX IMPORTS XXX */
const gulp = require('gulp');

const log = require('debug')('TODO:gulp');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// const babel = require('gulp-babel');
// const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');




/* XXX CONFIG XXX */
const AUTOPREFIXER_BROWSERS = [
	'> 1%',
	'last 2 versions'
];




/* XXX FRONTEND XXX */
gulp.task('sass', () => {
	return gulp.src('./src/public/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
		.pipe(gulp.dest('./dist/pub/css'));
});

gulp.task('scripts', () => {
	return gulp.src('./src/public/js/*.js')
		.pipe(concat('main.js'))
		// .pipe(babel({ FIXME
		// 	presets: ['env']
		// }))
		// .pipe(uglify())
		.pipe(gulp.dest('./dist/pub/js'));
});

gulp.task('front', gulp.series('scripts', 'sass'));




/* XXX BACKEND XXX */
gulp.task('nodemon', (cb) => {

	let started = false;

	return nodemon({
		script: './server.js',
		watch: [
			'./server.js',
			'./node_modules/**/*',
			'./src/index.js',
			'./src/controllers/*.*',
			'./src/models/*.*',
			'./src/middleware/*.*',
			'./src/services/*.*'
		]
	}).on('start', () => {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('browsersync', (done) => {
	log('browsersync init...');
	browserSync.init(null, {
		proxy: 'http://localhost:5000',
		files: ['./src/**/*.*'],
		port: 7000,
		reloadDelay: 1000
	});
	done();
});



gulp.task('app', gulp.series('nodemon', 'browsersync'));

gulp.task('default', gulp.series('app', () => {
	gulp.watch([
		'./server.js',
		'./src/public/**/*.*',
		'./src/controllers/*.*',
		'./src/models/*.*',
		'./src/middleware/*.*',
		'./src/services/*.*'
	], gulp.series('front'));
}));
