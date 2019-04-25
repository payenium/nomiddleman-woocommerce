// no JS :)

var validMpk = function(cryptoId, mpk) {
	mpkStart = mpk.substring(0, 5);

	if (mpkStart === 'xpub6' || mpkStart === 'ypub6' || mpkStart === 'zpub6') {
		if (mpk.length === 111) {
			return true;
		}	
	}

	return false;
}

var hideRemoveLinks = function (cryptoId, numberOfSamples) {
	for (let i = 0; i < numberOfSamples; i++) {
		jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-' + i + ' + a').hide();
	}
}

var makeReadonly = function (cryptoId, numberOfSamples) {
	for (let i = 0; i < numberOfSamples; i++) {
		jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-' + i).attr({'readonly': 'true'});
	}
}

var hideAddButton = function (cryptoId) {
	jQuery('#nmmpro_redux_options-' + cryptoId + '_hd_mpk_sample_addresses .redux-multi-text-add').hide();
}

var getMpk = function (cryptoId) {
	return mpk = jQuery('#' + cryptoId + '_hd_mpk-textarea').val().trim();
}

var updateSampleText = function (cryptoId, numberOfSamples, text) {
	for (let i = 0; i < numberOfSamples; i++) {
		jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-' + i).val(text);
	}	
}

jQuery(document).ready(function() {
	let numberOfSamples = 3;

	let hdCryptos = ['BTC', 'LTC', 'DASH', 'DOGE', 'QTUM'];

	hdCryptos.forEach(function (cryptoId) {
		hideRemoveLinks(cryptoId, numberOfSamples);
		makeReadonly(cryptoId, numberOfSamples);
		hideAddButton(cryptoId);

		jQuery('#' + cryptoId + '_hd_mpk-textarea').on('keyup', function(){

			let mpk = getMpk(cryptoId);

			if (!validMpk(cryptoId, mpk)) {
				updateSampleText(cryptoId, numberOfSamples, 'Please enter a valid mpk before saving');
				return;
			}
			
			jQuery.post({
				//type: "post",
				url: "admin-ajax.php",
				data: 
					{ action: 'firstmpkaddress', 							  
					  mpk: mpk,
					  cryptoId: cryptoId
					},
				beforeSend: function () {
					updateSampleText(cryptoId, numberOfSamples, 'Generating HD Addresses');
				}
			}).fail(function() {
				updateSampleText(cryptoId, numberOfSamples, 'HD Address generation failed, please double check your mpk');				
				console.log(stuff);
			}).done(function(ajaxResponse) {
				console.log('success');
				
				addresses = JSON.parse(ajaxResponse);

				if (addresses[0] === 'You have entered a valid Segwit MPK.') {
					updateSampleText(cryptoId, numberOfSamples, '');
					jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-0').val(addresses[0]);
					if (jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-0').parent().children().length === 2) {
						jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-0').parent().append(addresses[1]);		
					}
					
				}
				else {
					jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-0').val(addresses[0]);
					jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-1').val(addresses[1]);
					jQuery('#' + cryptoId + '_hd_mpk_sample_addresses-2').val(addresses[2]);				
				}
			}); //close jQuery.ajax(
		});
	});

	
});