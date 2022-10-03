( function ( $ ) {
	$( function ( $ ) {

		$( document ).on( 'submit', '.swp-form', function ( ev ) {
			ev.preventDefault();
			var form = $( this );

			form.find( '.swp-email-valid-error, .swp-email-duplicate-error,.swp-success' ).hide();

			var subscribe_email = form.find( '.field-email' ).val();
			var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
			valid = String( subscribe_email ).search( filter ) != -1;

			// Email check
			if ( subscribe_email == '' || !valid ) {
				form.find( '.swp-email-valid-error' ).slideDown();
				return false;
			}

			// Validation
			var validationFailed = false;
			form.find( '.swp-field' ).each(function(){
				var required =  $(this).data('required');
				var value = $.trim($(this).val());
				var fieldname = $(this).attr('name');
				var type = $(this).attr('type');
				if( ( type == 'checkbox' ||  type == 'radio') &&  required == '1'){

					var fieldChecked = false;
					form.find('input[name="'+fieldname+'"]').each(function(){
						if( $(this).is(':checked') ){
							fieldChecked = true;
						}
					})

					validationFailed =  ! fieldChecked ? true : validationFailed;
					//console.log(validationFailed);
					if(validationFailed ){
						$(this).parent().css('border', '1px solid red');
					}
				}
				else if( required == '1' && ! value.length ) {
					$(this).css('border-color', 'red');
					validationFailed = true;
				}
			});
			//console.log(validationFailed);
			if( validationFailed ){
				return false;
			}

			//Terms Check
			$terms = form.find( '.swp-terms' )
			if ( $terms.length > 0 ) {
				if ( !$terms.prop( 'checked' ) ) {
					alert( 'Please check checkbox' );
					return false;
				}
			}
			// remove red validation borders
			form.find( '.swp-field' ).each(function(){
				var required =  $(this).data('required');
				var fieldname = $(this).attr('name');
				var type = $(this).attr('type');
				if( type == 'checkbox' ||  type == 'radio'){
					$(this).parent().css('border', '0px solid green');
				}else if(required == '1'){
					$(this).css('border-color', 'green');
				}
			})

			form.find( '.swp-spinner' ).fadeIn();

			var form_data = form.serialize();

			data = {
				'action': 'swp_form_submit',
				formdata: form_data
			}

			$.post( swp.ajaxurl, data, function ( result, textStatus, xhr ) {
				form.find( '.swp-spinner' ).fadeOut();
				response = $.trim( result );
				//console.log(response); return;
				if ( response == '1' ) {
					var redirect_url = form.find( '.redirect_url' ).val();
					if ( redirect_url != '' ) {
						window.location.href = redirect_url;
					} else {
						//no redirect url found
						//alert('Thanks for subscribing.')
						form.find( '.swp-success' ).slideDown();
						if ( typeof grecaptcha != "undefined" ) {
							grecaptcha.reset()
						}
						//reset the fields
						form.find( '.field-name' ).val( '' );
						form.find( '.field-email' ).val( '' );
					}
				} else if ( response == 'Already subscribed.' ) {
					form.find( '.swp-email-duplicate-error' ).slideDown();
					if ( typeof grecaptcha != "undefined" ) {
						grecaptcha.reset()
					}
				} else if ( response == 'invalid-captcha' ) {
					form.find( '.swp-captcha-error' ).slideDown();
					if ( typeof grecaptcha != "undefined" ) {
						grecaptcha.reset()
					}
				} else {
					if ( typeof grecaptcha != "undefined" ) {
						grecaptcha.reset()
					}
				}

			} );

		} )
	} )

} )( jQuery )