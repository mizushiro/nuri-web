'use strict';
(function($, window, document){
	GlobalEvent.on('onAppConfigUpdated', function(e) {
		
	});

	function getPrefix() {
		if(window.appBase) {
			return window.appBase;
		} else {
			return "/";
		}
	};

	function tmValidate(str) {
		var reg = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}$");
		return reg.test(str);
	}

	var dt = moment();
	var yesterday = dt.subtract(1, 'day');
	var v = 'mi';
	var formats = {
		'yy': 'YYYY',
		'mm': 'YYYY-MM',
		'dd': 'YYYY-MM-DD',
		'mi': 'YYYY-MM-DD HH:mm',
	}


	$(`#input-tm-${v}-end`).val(yesterday.format('YYYY-MM-DD HH:mm'));

	$('#input-tm-dd-start, #input-tm-dd-end').datepicker({
		changeYear:true,
		changeMonth:true,
		yearRange: `2022:2026`,
		// minDate: "-1y",
		maxDate: "+0m +0w",
	});

	// 월 선택용 datepicker
	$("#input-tm-mm-start, #input-tm-mm-end").addClass("month-picker").datepicker({
		dateFormat: "yy-mm", 
		changeMonth: true,
		changeYear: true,
		yearRange: `2022:2026`,
		// minDate: "-1y",
		showButtonPanel: true,
		closeText: "선택", 
		beforeShow: function(input, inst) {
			setTimeout(function() {
				// $("#ui-datepicker-div").removeClass("hide-calendar hide-month"); 
				// $("#ui-datepicker-div").addClass("hide-calendar"); 
				$(".ui-datepicker-calendar").css("display", "none"); 
				const prev = $(input).val();
				if (prev && prev.length === 7) {
					const parts = prev.split("-");
					const year = parseInt(parts[0], 10);
					const month = parseInt(parts[1], 10) - 1;
					$(input).datepicker("setDate", new Date(year, month, 1));
				}
			}, 0);
		},
		onClose: function(dateText, inst) { 
			var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
			var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
			var formattedMonth = ("0" + (parseInt(month) + 1)).slice(-2); 
			$(this).val(year + '-' + formattedMonth); 
		},
		onChangeMonthYear: function(year, month, inst) {
			// 연도 또는 월 변경 시 날짜 숨김 유지
			setTimeout(function() {
				// $("#ui-datepicker-div").addClass("hide-calendar");
				$(".ui-datepicker-calendar").css("display", "none"); 
			}, 0);
		}
	});

	// 연도 선택용 datepicker (월 & 날짜 숨기기)
	$("#input-tm-yy-start, #input-tm-yy-end").addClass("year-picker").datepicker({
		dateFormat: "yy",
		changeYear: true,
		showButtonPanel: true,
		yearRange: `2022:2026`,
		// minDate: "-1y",
		closeText: "선택",
		beforeShow: function(input, inst) {
			setTimeout(function() {
				// $("#ui-datepicker-div").removeClass("hide-calendar hide-month");
				// $("#ui-datepicker-div").addClass("hide-month hide-calendar"); 
				$(".ui-datepicker-month").css("display", "none"); 
				$(".ui-datepicker-calendar").css("display", "none");
				const prev = $(input).val();
				if (prev && prev.length === 7) {
					const parts = prev.split("-");
					const year = parseInt(parts[0], 10);
					const month = parseInt(parts[1], 10) - 1;
					$(input).datepicker("setDate", new Date(year, month, 1));
				}
			}, 0);
		},
		onClose: function(dateText, inst) { 
			var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
			$(this).val(year);
		},
		onChangeMonthYear: function(year, month, inst) {
			// 연도 변경 시 월 선택 드롭다운 & 날짜 숨김 유지
			setTimeout(function() {
				// $("#ui-datepicker-div").addClass("hide-month hide-calendar");
				$(".ui-datepicker-month").css("display", "none"); 
				$(".ui-datepicker-calendar").css("display", "none"); 
			}, 0);
		}
	});

	function resetDatepicker(target) {
		$(target).datepicker("destroy"); 

		setTimeout(function() {
			$(".ui-datepicker-calendar").css("display", "table"); 
			$(".ui-datepicker-month").css("display", "block"); 

			$(target).datepicker({
				dateFormat: "yy-mm-dd HH:mm",
				changeMonth: true,
				changeYear: true,
				showButtonPanel: true,
				beforeShow: function(input, inst) {
					setTimeout(function() {
						$(".ui-datepicker-calendar").css("display", "table"); 
						$(".ui-datepicker-month").css("display", "block"); 
					}, 0);
				},
				onClose: function() {
					$(".ui-datepicker-calendar").css("display", "table"); 
				}
			}).datepicker("show");
		}, 10);
	}

	// 실시간 또는 일별 선택 시 datepicker를 리셋
	$(".realtime-datepicker, .daily-datepicker, .default-datepicker").on("focus", function() {
		resetDatepicker(this);
	});

	$('[data-move]').on('click', function(e) {
		e.preventDefault();

		var unit = $(this).data('move-unit');
		var amount = $(this).data('move');

		if (amount == 'now') {
			dt = moment();
		}
		else {
			var standardDt = moment( $(`#input-tm-${v}-end`).val() );

			var newDt = standardDt.add(amount, unit);
			if (newDt > moment()) {
				alert('기준시간이 현재보다 미래입니다.');
				return;
			}

			// set end dt
			dt = newDt;

			if (v != 'mi') {
				var startDt = moment( $(`#input-tm-${v}-start`).val() );
				var newStartDt = startDt.add(amount, unit);

				if (newStartDt > moment()) {
					alert('기준시간이 현재보다 미래입니다.');
					return;
				}
				if (newStartDt > dt) {
					alert('자료 시작 시간이 종료 시간보다 미래입니다.');
					return;
				}

				// set start dt
				$(`#input-tm-${v}-start`).val(newStartDt.format(formats[v]));
			}
		}

		$(`#input-tm-${v}-end`).val(dt.format(formats[v]));

	});

	$('#select-unit').on('change', function(e) {
		v = $(this).val();
		$('#wrap-interval')[v == 'mi' ? 'removeClass' : 'addClass']('hidden');
		$('#tm-simple')[v == 'mi' ? 'removeClass' : 'addClass']('hidden');
		$('#tm-datepicker')[v == 'mi' ? 'addClass' : 'removeClass']('hidden');

		$('.datepicker-wrap').addClass('hidden');
		$(`#tm-datepicker-${v}`).removeClass('hidden');

		$('.interval-selector').addClass('hidden');
		$(`#interval-${v}`).removeClass('hidden');

		// setting default values
		var defaultDt = yesterday;
		if (v == 'yy' || v == 'mm') {
			defaultDt = dt.subtract(1, 'month');
		}
		$(`#input-tm-${v}-start`)?.val( defaultDt.format(formats[v]) )
		$(`#input-tm-${v}-end`)?.val( defaultDt.format(formats[v]) )
	})

	$('input[name=admdst_dv]').on('change', function(e) {
		$('#skg-wrap')[$('input[name=admdst_dv]:checked').val() == 'skg' ? 'removeClass' : 'addClass']('hidden');
	})

	// $('#select-skg input.check-all').on('change', function(e) {
	// 	if ($(this).is(':checked')) {
	// 		$('#select-skg input').prop('checked', true);
	// 	}
	// 	else {
	// 		$('#select-skg input').prop('checked', false);
	// 	}
	// });

	$('#select-skg input').on('change', function(e) {
		if ($(this).hasClass('check-all')) {
			if ($(this).is(':checked')) {
				$('#select-skg input').prop('checked', true);
			}
			else {
				$('#select-skg input').prop('checked', false);
			}
		}
		else {
			$('.check-all').prop('checked', $('#select-skg input:checked').not('.check-all').length == 17);
		}
	})

	$('#lgt-form').on('submit', function(e) {
		e.preventDefault();

		var $tbody = $('#lgt-table tbody');
		var v = $('#select-unit').val();
		var endDt = moment( $(`#input-tm-${v}-end`).val() );
		var startDt, diff, unit;

		if (!$(`#input-tm-${v}-end`).val()) { 
			alert("자료조회 시각이 설정되지 않았습니다.");
			return false;
		}

		if (v == 'mi') {
			diff = $('#select-interval').val();
		}
		else {
			if (!$(`#input-tm-${v}-start`).val()) { 
				alert("자료조회 시작 시각이 설정되지 않았습니다.");
				return false;
			}

			startDt = moment( $(`#input-tm-${v}-start`).val() );

			if (startDt > moment() || endDt > moment() ) {
				alert('기준시각이 현재보다 미래입니다.');
				return;
			}
			if (startDt > endDt) {
				alert('자료조회 시작 시각이 종료 시각보다 미래입니다.');
				return;
			}

			var units = {
				'dd': 'days',
				'mm': 'months',
				'yy': 'months', // due to bug, calculate diff using months
			}
			diff = endDt.diff(startDt, units[v]);

			if (v == 'yy') {
				// due to bug, get year difference in months
				endDt = endDt.month(11).date(31).hour(23).minute(59);
				diff = ( parseInt(endDt.format('YYYY')) - parseInt(startDt.format('YYYY')) + 1) * 12;
			}

			if (
				(units[v] == 'days' && diff > 367) ||
				(units[v] == 'months' && diff > 12)
			 ) {
				alert('한 번에 조회할 수 있는 기간은 최대 1년(12개월)입니다.');
				return;
			}

		}

		$tbody.empty().append(`<tr><td colspan='2' class='text-center'>조회 중입니다...</td></tr>`);

		$.ajax({
			url: $(this).attr('action'),
			type: $(this).attr('method'),
			cache: false,
			data: {
				'tm': endDt.format('YYYYMMDDHHmm'),
				'interval': diff,
				'unit': v,
				'admdst_dv': $('input[name=admdst_dv]:checked').val(),
				'disp': 0,
				'help': 0,
			},
			dataType: "json",
			success:function(res) {
				var rows = '';

				if (res.data.length > 0) {
					res.data.forEach((item) => {
						if ($('input[name=admdst_dv]:checked').val() == 'skg') {
							$('input[name=skg]:checked').each(function() {
								if ( item[1].includes ( $(this).val() ) ) {
									rows += `
										<tr>
											<td>${item[1]}</td>
											<td>${parseInt(item[3]).toLocaleString()}</td>
										</tr>
									`;
								}
							});
						}
						else {
							rows += `
								<tr>
									<td>${item[1]}</td>
									<td>${parseInt(item[3]).toLocaleString()}</td>
								</tr>
							`;
						}
					});
				}
				else {
					rows += `<tr><td colspan='2' class='text-center'>해당 기간의 데이터가 조회되지 않았습니다.</td></tr>`;
				}

				$tbody.empty().append(rows);

			},
			error: function(data) {
				if(window.console) window.console.log(data);
			},
		});

	});

})(jQuery, window, document);
