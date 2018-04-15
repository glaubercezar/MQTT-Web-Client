var gulp        = require('gulp'),
	browserSync = require('browser-sync').create();

//Cria um servidor local
gulp.task('server', [], function() {

	browserSync.init({
		server: "./app"
	});

	//watch changes files to live reload

	var files = [
		'./app/*.html',
		'./app/*.js',
		'./app/**/*.html',
		'./app/**/*.js',
		'./app/assets/css/*.css'
	];

	gulp.watch(files).on('change', browserSync.reload);
});

gulp.task('default', ['server']);
