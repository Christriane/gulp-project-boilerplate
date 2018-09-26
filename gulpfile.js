const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const useref = require('gulp-useref')
const uglify = require('gulp-uglify')
const gulpIf = require('gulp-if')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const del = require('del')
const runSequence = require('run-sequence')
const autoprefixer = require('gulp-autoprefixer')

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

gulp.task('sass', () => {
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
})

// Watchers
gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('app/scss/**/*.scss', ['sass'])
    gulp.watch('app/*.html', browserSync.reload)
    gulp.watch('app/js/**/*.js', browserSync.reload)
})


// Optimization 

gulp.task('useref', () => {
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

gulp.task('images', () => {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', () => {
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean', () => {
   return del.sync('dist').then((callback) => {
    return cache.clearAll(callback)
   })
})

// Clean 
gulp.task('clean:dist', () => {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*'])
})

// Build
gulp.task('default', (callback) => {
    runSequence(['sass', 'browserSync'], 'watch', callback)
})

gulp.task('build', (callback) => {
    runSequence(
        'clean:dist',
        'sass',
        ['useref', 'images', 'fonts'],
        callback
    )
})




