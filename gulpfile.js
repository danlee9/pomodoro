var gulp = require('gulp');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');

gulp.task('clean', function() {
	gulp.src('./build', {read: false})
		.pipe(clean());
});

gulp.task('copy', ['clean'], function() {
	gulp.src(['./app/alarm.wav',
		'./app/bower_components/font-awesome/**/*.svg',
    './app/bower_components/font-awesome/**/*.eot',
    './app/bower_components/font-awesome/**/*.ttf',
    './app/bower_components/font-awesome/**/*.woff',
    './app/bower_components/font-awesome/**/*.otf',])
		.pipe(gulp.dest('./build'));
});

gulp.task('usemin', ['copy'], function() {
	gulp.src('./app/index.html')
		.pipe(usemin({
			css: [minifyCSS()],
			js: [uglify()]
		}))
		.pipe(gulp.dest('./build'));
});

gulp.task('build', ['usemin']);