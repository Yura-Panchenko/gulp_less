'use strict'

var gulp = require('gulp'),
	gp   = require('gulp-load-plugins')(),
	browserSync = require('browser-sync').create();

// Static server
gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: "./public"
		}
	});
});

gulp.task('pug', function(){
	return gulp.src('dev/pug/*.pug')
		.pipe(gp.pug({
			pretty:true
		}))
		.pipe(gulp.dest('public'))
		.on('end',browserSync.reload);
});

gulp.task('less', function(){
	return gulp.src('dev/less/*.less')
		.pipe(gp.sourcemaps.init())
		.pipe(gp.less({}))
		.pipe(gp.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.on("error", gp.notify.onError({
			message: "Error: <%= error.message %>",
			title: "LESS ERROR!!!"
		}))
		// .pipe(gp.csso())
		.pipe(gp.sourcemaps.write())
		.pipe(gulp.dest('public'))
		.pipe(browserSync.reload({
			stream:true
		}));
});

gulp.task('copy', function () {
	return gulp.src('dev/assets/**/*.*')
		.pipe(gulp.dest('public/'));
});

gulp.task('watch', function(){
	gulp.watch('dev/pug/**/*.pug', gulp.series('pug'))
	gulp.watch('dev/less/**/*.less', gulp.series('less'))
	gulp.watch('dev/assets/**/*.*', gulp.series('copy'))
});

gulp.task('default', gulp.series(
	gulp.parallel('pug','less'),
	gulp.parallel('watch','serve')
));
