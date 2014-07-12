var fs = require('fs')
var request = require('request')
var progress = require('request-progress')
var cheerio = require('cheerio')
var path = require('path')

var url = 'http://www.surfermag.com/wallpapers/'
var saveDirectory = process.env['HOME'] + '/Pictures/surfing/test'
var wallpaperSize = '1600x1200'

request(url, function (error, response, html) {
	if(!error){
		var $ = cheerio.load(html)	
		$('.wallpapers').find('a').filter(function(index, element) {			
			return $(this).text() == wallpaperSize
		}).each(function(i, hrefElement) {				
			var downloadLink = $(this).attr('href')
			var fileName = path.basename(downloadLink)
			var saveFilePath = path.join(saveDirectory, fileName)			

			progress(request(downloadLink))
			.pipe(fs.createWriteStream(saveFilePath)).on('close', function(err){				
				console.log('File saved: ' + this.path)
			})
		})
	};
})