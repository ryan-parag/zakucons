var gulp = require('gulp'),
	pug = require('gulp-pug'),
	prefix = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	minifyCSS = require('gulp-minify-css'),
	cleanCSS = require('gulp-clean-css'),
	notify = require('gulp-notify'),
	concat = require('gulp-concat'),
	path = require('path'),
	rename = require('gulp-rename');

var paths = {
  public: './dist/',
  sass: './src/scss/',
  css: './dist/css/',
  data: './src/_data/',
	pug: './src/*.pug'
};

var prefixerOptions = {
  browsers: ['last 2 versions']
};

var sassOptions = {
  outputStyle: 'compressed'
};

var displayError = function(error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin.error.bold + ']';
  errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if(error.fileName)
      errorString += ' in ' + error.fileName;

  if(error.lineNumber)
      errorString += ' on line ' + error.lineNumber.bold;

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
};

var onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};


/* SCSS
---------------------------------------------*/
gulp.task('sass', function (){
	return gulp.src(paths.sass + 'main.scss')
		.pipe(sass())
		.pipe(sass(sassOptions))
		.pipe(prefix(prefixerOptions))
		.pipe(concat('main.css'))
		.pipe(cleanCSS())
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest(paths.css));
});


/* PUG
---------------------------------------------*/
gulp.task('pug',function (){
	return gulp.src(paths.pug)
		.pipe(pug({
      pretty: true
    }))
			.on('error', notify.onError(function (error) {
    		return 'An error occurred while compiling pug.\nLook in the console for details.\n' + error;
			}))
		.pipe(gulp.dest(paths.public));
});

gulp.task('rebuild', ['pug', 'sass'], function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'pug'], function () {
  browserSync({
    server: {
      baseDir: paths.public
    },
    notify: false
  });
});

/* WATCH
---------------------------------------------*/
gulp.task('watch', function (){
	gulp.watch(paths.sass + '**/*.scss',['sass']);
	gulp.watch('./src/**/*.pug', ['rebuild']);
});

/* BUILD
---------------------------------------------*/
gulp.task('build', ['sass', 'pug']);

/* BROWSER SYNC
---------------------------------------------*/
gulp.task('default', ['browser-sync', 'watch']);