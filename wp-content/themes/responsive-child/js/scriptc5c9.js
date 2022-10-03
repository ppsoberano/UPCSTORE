jQuery(function(){
    jQuery('#calc_div .calculate').on('click', function(){
        var number = jQuery('#codesNumber').val();
        if (isNaN(number))
            return;
        var data = {
			action: 'get_product_price',
			product: 205,
            quantity: number
		};
        jQuery('.priceResultContainer').slideUp();
		jQuery.post( '/wp-admin/admin-ajax.php', data, function( response ){
            jQuery('.priceResult').text( '$' + (response*number).toFixed(2) + ' ($' + parseFloat(response).toFixed(2) + '/code)' );
            jQuery('.priceResultContainer a').prop('href', '/checkout/?post_type=product&add-to-cart=205&quantity=' + number);
			jQuery('.priceResultContainer').slideDown();
		} );
    });
    
    jQuery('.star-selector__selector .star').on('mouseover', function (){
        jQuery('.star-rating-tp img').attr('src', 'https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-'+jQuery(this).val()+'.svg');
        jQuery('.star-selector-anchor').attr('href', 'https://www.trustpilot.com/evaluate/snapupc.com?stars=' + jQuery(this).val());
    });

    jQuery('.star-selector__selector').on('mouseleave', function (){
        jQuery('.star-rating-tp img').attr('src', 'https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-0.svg');
    });
    
    jQuery('.star-selector__selector input').on('click', function (){
        window.open(jQuery(this).parents('a.star-selector-anchor').attr('href'), '_blank');
    });
    
    jQuery('a.star-selector-anchor').on('click', function(e){
        e.preventDefault();
    });
    
    jQuery('.checkDigitForm').on('submit', function() {
		let code = jQuery(this).find('input').val();
		if (isNaN(code)) return false;
        if (code.length != 11 && code.length != 12) {
            jQuery('.checkDigitResult div').html('<strong>Please, enter 11 digit UPC or 12 digit EAN</strong>').parent().show();
            return false;
        }
		jQuery('.checkDigitResult div').html(code + '<strong>' + checkdigit(code) + '</strong>').parent().show();
		return false;
	});
    
});

//https://github.com/hampus-nilsson/gs1-checkdigit/blob/main/checkdigit.js
function checkdigit(input) {
    let array = input.split('').reverse();

    let total = 0;
    let i = 1;
    array.forEach(number => {
        number = parseInt(number);
        if (i % 2 === 0) {
            total = total + number;
        }
        else
        {
            total = total + (number * 3);
        }
        i++;
    });

    return (Math.ceil(total / 10) * 10) - total;
}