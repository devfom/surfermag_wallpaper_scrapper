var fs = require('fs')
var request = require('request')
var progress = require('request-progress')
var cheerio = require('cheerio')
var path = require('path')

var url = 'http://www.surfermag.com/wallpapers/'
var saveDirectory = '/home/devfom/Pictures/surfing/test'

request(url, function (error, response, html) {
	if(!error){
		var $ = cheerio.load(html)	
		$('.wallpapers').find('a').filter(function(index, element) {			
			return $(this).text() == '1600x1200'
		}).each(function(i, hrefElement) {				
			var downloadLink = $(this).attr('href')
			var fileName = path.basename(downloadLink)
			var saveFilePath = path.join(saveDirectory, fileName)
			console.log("Downloading file " + fileName)

			progress(request(downloadLink), {
				throttle: 1000,
				delay: 1000
			}).on('progress', function(state) {
				console.log('percent ', state.percent)
			}).on('error', function(err) {
				console.log('Something went wrong')
			}).pipe(fs.createWriteStream(saveFilePath)).on('close', function(err){
				console.log('File saved')
			})
		})
	};
})