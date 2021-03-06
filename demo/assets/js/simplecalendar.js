var calendar = {

	init: function(ajax) {

		if (ajax) {

			// ajax call to print json
			$.ajax({
					url: 'data/events.json',
					type: 'GET',
				})
				.done(function(data) {
					var events = data.events;

					// loop json & append to dom
					for (var i = 0; i < events.length; i++) {
						$('.list').append('<div class="day-event" event-class="' + events[i].class + '" date-day="' + events[i].day + '" date-month="' + events[i].month + '" date-year="' + events[i].year + '" data-number="' + i + '"><a href="#" class="close fontawesome-remove"></a><h2 class="title">' + events[i].title + '</h2><p>' + events[i].description + '</p><label class="check-btn"><input type="checkbox" class="save" id="save" name="" value=""/><span>Save to personal list!</span></label></div>');
					}

					// start calendar
					calendar.startCalendar();

				})
				.fail(function(data) {
					console.log(data);
				});
		} else {

			// if not using ajax start calendar
			calendar.startCalendar();
		}

	},

	startCalendar: function() {
		var mon = '周一';
		var tue = '周二';
		var wed = '周三';
		var thur = '周四';
		var fri = '周五';
		var sat = '周六';
		var sund = '周日';

		/**
		 * Get current date
		 */
		var d = new Date();
		var strDate = yearNumber + "/" + (d.getMonth() + 1) + "/" + d.getDate();
		var yearNumber = (new Date).getFullYear();
		/**
		 * Get current month and set as '.current-month' in title
		 */
		var monthNumber = d.getMonth() + 1;

		function GetMonthName(monthNumber) {
			//var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			var months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
			return months[monthNumber - 1];
		}

		setMonth(monthNumber, mon, tue, wed, thur, fri, sat, sund);

		function setMonth(monthNumber, mon, tue, wed, thur, fri, sat, sund) {
			$('.month').text(GetMonthName(monthNumber) + ' ' + yearNumber);
			$('.month').attr('data-month', monthNumber);
			printDateNumber(monthNumber, mon, tue, wed, thur, fri, sat, sund);
		}
		$('.calendar  tr td, .calendar  tr th').width(($('.calendar header').width() - 50) / 7);
		$('.btn-next').on('click', function(e) {
			var monthNumber = $('.month').attr('data-month');
			if (monthNumber > 11) {
				$('.month').attr('data-month', '0');
				var monthNumber = $('.month').attr('data-month');
				yearNumber = yearNumber + 1;
				setMonth(parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
			} else {
				setMonth(parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
			};
		});

		$('.btn-prev').on('click', function(e) {
			var monthNumber = $('.month').attr('data-month');
			if (monthNumber < 2) {
				$('.month').attr('data-month', '13');
				var monthNumber = $('.month').attr('data-month');
				yearNumber = yearNumber - 1;
				setMonth(parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
			} else {
				setMonth(parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
			};
		});

		/**
		 * Get all dates for current month
		 */

		function printDateNumber(monthNumber, mon, tue, wed, thur, fri, sat, sund) {

			$($('tbody.event-calendar tr')).each(function(index) {
				$(this).empty();
			});

			$($('thead.event-days tr')).each(function(index) {
				$(this).empty();
			});

			function getDaysInMonth(month, year) {
				// Since no month has fewer than 28 days
				var date = new Date(year, month, 1);
				var days = [];
				while (date.getMonth() === month) {
					days.push(new Date(date));
					date.setDate(date.getDate() + 1);
				}
				return days;
			}

			i = 0;

			setDaysInOrder(mon, tue, wed, thur, fri, sat, sund);

			var monthDay = getDaysInMonth(monthNumber - 1, yearNumber)[0].toString().substring(0, 3);
			var weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
			var firstDay = weekDays.indexOf(monthDay);

			function setDaysInOrder(mon, tue, wed, thur, fri, sat, sund) {
				//$('thead.event-days tr').append('<td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td>');
				$('thead.event-days tr').html('<td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td>');
			};

			var item = 0;
			var tr = $('<tr></tr>');
			$('tbody.event-calendar').append(tr);

			for (var i = 0; i < firstDay; i++) {
				//$('tbody.event-calendar tr').append('<td></td>');
				tr.append('<td></td>');
				item++;
			}

			$(getDaysInMonth(monthNumber - 1, yearNumber)).each(function(index) {
				if (item % 7 === 0) {
					tr = $('<tr></tr>');
					$('tbody.event-calendar').append(tr);
				}
				var monthDay = getDaysInMonth(monthNumber - 1, yearNumber)[0].toString().substring(0, 3);
				var index = index + 1;
				tr.append('<td date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
				i++;
				item++;
			});
			var date = new Date();
			var month = date.getMonth() + 1;
			var thisyear = new Date().getFullYear();
			setCurrentDay(month, thisyear);
			setEvent();
			displayEvent();
		}

		/**
		 * Get current day and set as '.current-day'
		 */
		function setCurrentDay(month, year) {
			var viewMonth = $('.month').attr('data-month');
			var eventYear = $('.event-days').attr('date-year');
			if (parseInt(year) === yearNumber) {
				if (parseInt(month) === parseInt(viewMonth)) {
					$('tbody.event-calendar td[date-day="' + d.getDate() + '"]').addClass('current-day');
				}
			}
		};

		/**
		 * Add class '.active' on calendar date
		 */
		/*
		$('tbody td').on('click', function(e) {
			if ($(this).hasClass('event')) {
				$('tbody.event-calendar td').removeClass('active');
				$(this).addClass('active');
			} else {
				$('tbody.event-calendar td').removeClass('active');
			};
		});
		*/

		/**
		 * Add '.event' class to all days that has an event
		 */
		function setEvent() {
			$('.day-event').each(function(i) {
				var eventMonth = $(this).attr('date-month');
				var eventDay = $(this).attr('date-day');
				var eventYear = $(this).attr('date-year');
				var eventClass = $(this).attr('event-class');
				if (eventClass === undefined) eventClass = 'event';
				else eventClass = 'event ' + eventClass;

				if (parseInt(eventYear) === yearNumber) {
					$('tbody.event-calendar tr td[date-month="' + eventMonth + '"][date-day="' + eventDay + '"]').addClass(eventClass);
				}
			});
		};

		/**
		 * Get current day on click in calendar
		 * and find day-event to display
		 */
		function displayEvent() {
			$('tbody.event-calendar td').on('click', function(e) {
				$('.day-event').slideUp('fast');
				var monthEvent = $(this).attr('date-month');
				var dayEvent = $(this).text();
				$('.day-event[date-month="' + monthEvent + '"][date-day="' + dayEvent + '"]').slideDown('fast');
			});
		};

		/**
		 * Close day-event
		 */
		$('.close').on('click', function(e) {
			$(this).parent().slideUp('fast');
		});

		/**
		 * Save & Remove to/from personal list
		 */
		$('.save').click(function() {
			if (this.checked) {
				$(this).next().text('Remove from personal list');
				var eventHtml = $(this).closest('.day-event').html();
				var eventMonth = $(this).closest('.day-event').attr('date-month');
				var eventDay = $(this).closest('.day-event').attr('date-day');
				var eventNumber = $(this).closest('.day-event').attr('data-number');
				$('.person-list').append('<div class="day" date-month="' + eventMonth + '" date-day="' + eventDay + '" data-number="' + eventNumber + '" style="display:none;">' + eventHtml + '</div>');
				$('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"]').slideDown('fast');
				$('.day').find('.close').remove();
				$('.day').find('.save').removeClass('save').addClass('remove');
				$('.day').find('.remove').next().addClass('hidden-print');
				remove();
				sortlist();
			} else {
				$(this).next().text('Save to personal list');
				var eventMonth = $(this).closest('.day-event').attr('date-month');
				var eventDay = $(this).closest('.day-event').attr('date-day');
				var eventNumber = $(this).closest('.day-event').attr('data-number');
				$('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').slideUp('slow');
				setTimeout(function() {
					$('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').remove();
				}, 1500);
			}
		});

		function remove() {
			$('.remove').click(function() {
				if (this.checked) {
					$(this).next().text('Remove from personal list');
					var eventMonth = $(this).closest('.day').attr('date-month');
					var eventDay = $(this).closest('.day').attr('date-day');
					var eventNumber = $(this).closest('.day').attr('data-number');
					$('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').slideUp('slow');
					$('.day-event[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').find('.save').attr('checked', false);
					$('.day-event[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').find('span').text('Save to personal list');
					setTimeout(function() {
						$('.day[date-month="' + eventMonth + '"][date-day="' + eventDay + '"][data-number="' + eventNumber + '"]').remove();
					}, 1500);
				}
			});
		}

		/**
		 * Sort personal list
		 */
		function sortlist() {
			var personList = $('.person-list');

			personList.find('.day').sort(function(a, b) {
				return +a.getAttribute('date-day') - +b.getAttribute('date-day');
			}).appendTo(personList);
		}

		/**
		 * Print button
		 */
		$('.print-btn').click(function() {
			window.print();
		});

		$('.today').click(function() {
			yearNumber = new Date().getFullYear();
			setMonth(monthNumber, mon, tue, wed, thur, fri, sat, sund);
		});
	},

};

$(document).ready(function() {
	calendar.init('ajax');
});