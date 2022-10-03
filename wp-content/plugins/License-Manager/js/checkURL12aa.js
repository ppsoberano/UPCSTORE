jQuery(function(){
    if (jQuery('.wc-item-meta-label:contains(Barcodes:)').parent().find('a').size())
    {
        jQuery('.wc-item-meta-label:contains(Barcodes:)').parent().find('a').hide().
        parent().append(jQuery('<div class="zipLoader"></div>')).
        append(jQuery('<span></span>').text('Order is in progress, please wait...'));
        
        let timerId = setTimeout(function request() {
            jQuery.ajax( "/wp-cron.php" );
            jQuery.ajax({
                url: jQuery('.wc-item-meta-label:contains(Barcodes:)').parent().find('a').attr('href'),
                type:'HEAD',
                error: function()
                {
                    timerId = setTimeout(request, 1000);
                },
                success: function()
                {
                    //file exists
                    jQuery('.wc-item-meta-label:contains(Barcodes:)').parent().find('a').show();
                    jQuery('.wc-item-meta-label:contains(Barcodes:)').parent().find('span').hide();
                    jQuery('.wc-item-meta-label:contains(Barcodes:)').parent().find('div').hide();
                }
            });
            
        }, 1000);
        
    }
    
});