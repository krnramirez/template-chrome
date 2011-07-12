/**
 * <p>Responsible for the options page.</p>
 * @author <a href="http://github.com/neocotic">Alasdair Mercer</a>
 * @since 0.0.2.1
 * @namespace
 */
var options = {

    /**
     * <p>Collapses the contents of all sections.</p>
     * @param {Event} [event] The event triggered.
     * @event
     * @requies jQuery
     * @private
     */
    collapseAll: function (event) {
        $('.section h4').addClass('toggle-expand')
                .removeClass('toggle-collapse').next('.content').slideUp();
    },

    /**
     * <p>Expands the contents of all sections.</p>
     * @param {Event} [event] The event triggered.
     * @event
     * @requies jQuery
     * @private
     */
    expandAll: function (event) {
        $('.section h4').addClass('toggle-collapse')
                .removeClass('toggle-expand').next('.content').slideDown();
    },

    /**
     * <p>Replaces the inner HTML of the selected element(s) with the localized
     * String looked up from Chrome.</p>
     * @param {String} selector A String containing a jQuery selector expression
     * to select the element(s) to be modified.
     * @param {String} name The name of the localized message to be retrieved.
     * @param {String|String[]} [sub] The String(s) to substituted in the
     * returned message (where applicable).
     * @returns {jQuery} The modified element(s) wrapped in jQuery.
     * @since 0.1.0.0 - Previously located in {@link utils}.
     * @requires jQuery
     * @private
     */
    i18nReplace: function (selector, name, sub) {
        if (typeof(sub) !== 'undefined') {
            return $(selector).html(chrome.i18n.getMessage(name, sub));
        }
        return $(selector).html(chrome.i18n.getMessage(name));
    },

    /**
     * <p>Initializes the options page.</p>
     * <p>This involves inserting and configuring the UI elements as well as
     * the insertion of localized Strings and most importantly loading the
     * current settings.</p>
     * @requires jQuery
     */
    init: function () {
        // Inserts localized Strings
        options.i18nReplace('title, #optionTitle', 'opt_title');
        options.i18nReplace('#featureSetting', 'opt_feature_header');
        // TODO: Remove ID selector
        options.i18nReplace('#settingFeatureEnabledText, .featureEnabledText',
                'opt_feature_enabled_text');
        options.i18nReplace('#urlShortenerSetting', 'opt_url_shortener_header');
        options.i18nReplace('#urlShortenerNameHeader',
                'opt_url_shortener_name_header');
        options.i18nReplace('#urlShortenerEnabledHeader',
                'opt_url_shortener_enabled_header');
        options.i18nReplace('#urlShortenerConfigHeader',
                'opt_url_shortener_config_header');
        options.i18nReplace('#bitlyXLoginText',
                'opt_url_shortener_username_text');
        options.i18nReplace('#bitlyXApiKeyText',
                'opt_url_shortener_api_key_text');
        options.i18nReplace('#googleOAuthEnabledText',
                'opt_url_shortener_oauth_enable_text');
        options.i18nReplace('#anchorSetting', 'opt_anchor_header');
        options.i18nReplace('#settingTargetAttrText', 'opt_anchor_target_text');
        options.i18nReplace('#settingTitleAttrText', 'opt_anchor_title_text');
        options.i18nReplace('#notificationSetting', 'opt_notification_header');
        options.i18nReplace('#settingNotificationText', 'opt_notification_text');
        options.i18nReplace('#settingNotificationTimerText1',
                'opt_notification_timer_text1');
        options.i18nReplace('#settingNotificationTimerText2',
                'opt_notification_timer_text2');
        options.i18nReplace('#shorcutSetting', 'opt_shortcut_header');
        options.i18nReplace('#settingShortcutText', 'opt_shortcut_text');
        options.i18nReplace('#ieTabSetting', 'opt_ie_tab_header');
        options.i18nReplace('#settingIeTabExtractText',
                'opt_ie_tab_extract_text');
        options.i18nReplace('#settingIeTabTitleText', 'opt_ie_tab_title_text');
        options.i18nReplace('#ieTabFooter', 'opt_ie_tab_footer');
        options.i18nReplace('#ieTabExtension', 'extension');
        options.i18nReplace('#ieTabWebsite', 'website');
        options.i18nReplace('#saveAndClose', 'opt_save_button');
        options.i18nReplace('#expandAll', 'opt_expand_all');
        options.i18nReplace('#collapseAll', 'opt_collapse_all');
        options.i18nReplace('#footer', 'opt_footer',
                String(new Date().getFullYear()));
        // Binds options:collapseAll and options:expandAll events to the links
        $('#collapseAll').click(options.collapseAll);
        $('#expandAll').click(options.expandAll);
        // Binds options:saveAndClose event to button
        $('#saveAndClose').click(options.saveAndClose);
        // Binds options:toggleSection to section headers
        $('.section h4').click(options.toggleSection);
        // Loads current option values
        options.load();
        var bg = chrome.extension.getBackgroundPage(), keyMods = '';
        if (bg.clipboard.isThisPlatform('mac')) {
            keyMods = bg.clipboard.shortcutMacModifiers;
        } else {
            keyMods = bg.clipboard.shortcutModifiers;
        }
        // TODO: Remove ID selector
        $('#settingFeatureShortcutText, .featureShortcutText').html(keyMods);
        // Displays IE Tab options if extension is detected
        // TODO: Verify data sent/received with IE Tab author and ammend below
        chrome.extension.sendRequest(bg.ietab.extensionId, {
            'key': 'version',
            'type': 'GETLS'
        }, function (response) {
            if (response) {
                $('#ieTabSettingDiv').show();
            }
        });
    },

    /**
     * <p>Updates the options page with the values of the current settings.</p>
     * @requires jQuery
     */
    load: function () {
        options.loadFeatures();
        options.loadNotifications();
        options.loadUrlShorteners();
        if (utils.get('settingShortcut')) {
            $('#settingShortcut').attr('checked', 'checked');
        } else {
            $('#settingShortcut').removeAttr('checked');
        }
        if (utils.get('settingTargetAttr')) {
            $('#settingTargetAttr').attr('checked', 'checked');
        } else {
            $('#settingTargetAttr').removeAttr('checked');
        }
        if (utils.get('settingTitleAttr')) {
            $('#settingTitleAttr').attr('checked', 'checked');
        } else {
            $('#settingTitleAttr').removeAttr('checked');
        }
        if (utils.get('settingIeTabExtract')) {
            $('#settingIeTabExtract').removeAttr('checked');
        } else {
            $('#settingIeTabExtract').attr('checked', 'checked');
        }
        if (utils.get('settingIeTabTitle')) {
            $('#settingIeTabTitle').attr('checked', 'checked');
        } else {
            $('#settingIeTabTitle').removeAttr('checked');
        }
    },

    /**
     * <p>Updates the feature section of the options page with the current
     * settings.</p>
     * @requires jQuery
     * @private
     */
    loadFeatures: function () {
        var bg = chrome.extension.getBackgroundPage();
        // Ensures clean slate
        $('#settingFeatures option').remove();
        // Creates and inserts options representing features
        for (var i = 0; i < bg.clipboard.features.length; i++) {
            var feature = bg.clipboard.features[i];
            var opt = $('<option/>', {
                'text': chrome.i18n.getMessage(feature.name),
                'value': feature.name
            }).appendTo('#settingFeatures');
            opt.data('enabled', String(feature.isEnabled()));
        }
        /*
         * Whenever the selected option changes we want all the controls to
         * represent the current selection (where possible).
         */
        $('#settingFeatures').change(function (event) {
            var opt = $(this).find('option:selected');
            // Disables all the controls as no option is selected
            if (opt.length === 0) {
                $('#moveDownButton, #moveUpButton, #settingFeatureEnabled')
                        .attr('disabled', 'disabled');
            } else {
                // Disables 'up' control as option is at top of the list
                if (opt.is(':first-child')) {
                    $('#moveUpButton').attr('disabled', 'disabled');
                } else {
                    $('#moveUpButton').removeAttr('disabled');
                }
                // Disables 'down' control as option is at bottom of the list
                if (opt.is(':last-child')) {
                    $('#moveDownButton').attr('disabled', 'disabled');
                } else {
                    $('#moveDownButton').removeAttr('disabled');
                }
                // Updates checkbox control to reflect if the feature's enabled
                if (opt.data('enabled') === 'true') {
                    $('#settingFeatureEnabled').attr('checked', 'checked');
                } else {
                    $('#settingFeatureEnabled').removeAttr('checked');
                }
                /*
                 * Disables checkbox control if option is for 'copy_url'
                 * feature.
                 */
                if (bg.feature.url.name === opt.val()) {
                    $('#settingFeatureEnabled').attr('disabled', 'disabled');
                } else {
                    $('#settingFeatureEnabled').removeAttr('disabled');
                }
            }
            /*
             * Ensures correct arrows display in 'up'/'down' controls depending
             * on whether or not the controls are disabled.
             */
            // TODO: Is this required on every change or just once?
            $('#moveDownButton:not([disabled]) img').attr('src',
                    '../images/move_down.gif');
            $('#moveUpButton:not([disabled]) img').attr('src',
                    '../images/move_up.gif');
            $('#moveDownButton[disabled] img').attr('src',
                    '../images/move_down_disabled.gif');
            $('#moveUpButton[disabled] img').attr('src',
                    '../images/move_up_disabled.gif');
        }).change();
        /*
         * Moves the selected option down one when the 'down' control is
         * clicked.
         */
        $('#moveDownButton').click(function (event) {
            var opt = $('#settingFeatures option:selected');
            opt.insertAfter(opt.next());
            $('#settingFeatures').change();
        });
        // Moves the selected option up one when the 'up' control is clicked
        $('#moveUpButton').click(function (event) {
            var opt = $('#settingFeatures option:selected');
            opt.insertBefore(opt.prev());
            $('#settingFeatures').change();
        });
        /*
         * Updates the 'enabled' data bound to the selected option when the
         * checkbox control is clicked.
         */
        $('#settingFeatureEnabled').click(function (event) {
            $('#settingFeatures option:selected').data('enabled',
                    String($(this).is(':checked')));
        });
    },

    /**
     * <p>Updates the notification section of the options page with the current
     * settings.</p>
     * @requires jQuery
     * @private
     */
    loadNotifications: function () {
        if (utils.get('settingNotification')) {
            $('#settingNotification').attr('checked', 'checked');
        } else {
            $('#settingNotification').removeAttr('checked');
        }
        var timeInSecs = 0;
        if (utils.get('settingNotificationTimer') > timeInSecs) {
            timeInSecs = utils.get('settingNotificationTimer') / 1000;
        }
        // Ensures clean slate
        $('#settingNotificationTimer option').remove();
        // Creates and inserts options for available auto-hide time in seconds
        for (var i = 0; i <= 30; i++) {
            var opt = $('<option/>', {
                'text': i,
                'value': i
            });
            if (i === timeInSecs) {
                opt.attr('selected', 'selected');
            }
            opt.appendTo('#settingNotificationTimer');
        }
    },

    /**
     * <p>Updates the URL shorteners section of the options page with the
     * current settings.</p>
     * @requires jQuery
     * @private
     */
    loadUrlShorteners: function () {
        $('input[name="settingEnabledUrlShortener"]').each(function () {
            var radio = $(this);
            if (utils.get(radio.attr('id'))) {
                radio.attr('checked', 'checked');
            }
        });
        $('#bitlyXApiKey').val(utils.get('bitlyXApiKey'));
        $('#bitlyXLogin').val(utils.get('bitlyXLogin'));
        if (utils.get('googleOAuthEnabled')) {
            $('#googleOAuthEnabled').attr('checked', 'checked');
        } else {
            $('#googleOAuthEnabled').removeAttr('checked');
        }
    },

    /**
     * <p>Updates the settings with the values from the options page.</p>
     * @requires jQuery
     */
    save: function () {
        utils.set('settingShortcut', $('#settingShortcut').is(':checked'));
        utils.set('settingTargetAttr', $('#settingTargetAttr').is(':checked'));
        utils.set('settingTitleAttr', $('#settingTitleAttr').is(':checked'));
        utils.set('settingIeTabExtract',
                !$('#settingIeTabExtract').is(':checked'));
        utils.set('settingIeTabTitle', $('#settingIeTabTitle').is(':checked'));
        options.saveFeatures();
        options.saveNotifications();
        options.saveUrlShorteners();
    },

    /**
     * <p>Updates the settings with the values from the options page and closes
     * the current tab.</p>
     * @param {Event} [event] The event triggered.
     * @event
     * @requies jQuery
     * @private
     */
    saveAndClose: function (event) {
        options.save();
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.remove(tab.id);
        });
    },

    /**
     * <p>Updates the settings with the values from the feature section of the
     * options page.</p>
     * @requires jQuery
     * @private
     */
    saveFeatures: function () {
        var bg = chrome.extension.getBackgroundPage();
        /*
         * Updates each individual feature settings based on their
         * corresponding options.
         */
        $('#settingFeatures option').each(function (index) {
            var opt = $(this);
            switch (opt.val()) {
                case bg.feature.anchor.name:
                    utils.set('copyAnchorEnabled',
                            opt.data('enabled') === 'true');
                    utils.set('copyAnchorOrder', index);
                    break;
                case bg.feature.bbcode.name:
                    utils.set('copyBBCodeEnabled',
                            opt.data('enabled') === 'true');
                    utils.set('copyBBCodeOrder', index);
                    break;
                case bg.feature.encoded.name:
                    utils.set('copyEncodedEnabled',
                            opt.data('enabled') === 'true');
                    utils.set('copyEncodedOrder', index);
                    break;
                case bg.feature.short.name:
                    utils.set('copyShortEnabled',
                            opt.data('enabled') === 'true');
                    utils.set('copyShortOrder', index);
                    break;
                case bg.feature.url.name:
                    utils.set('copyUrlEnabled',
                            opt.data('enabled') === 'true');
                    utils.set('copyUrlOrder', index);
                    break;
            }
        });
        // Ensures features data reflects the updated settings
        bg.clipboard.updateFeatures();
    },

    /**
     * <p>Updates the settings with the values from the notification section of
     * the options page.</p>
     * @requires jQuery
     * @private
     */
    saveNotifications: function () {
        utils.set('settingNotification',
                $('#settingNotification').is(':checked'));
        var timeInSecs = $('#settingNotificationTimer').val();
        timeInSecs = (timeInSecs) ? parseInt(timeInSecs, 10) * 1000 : 0;
        utils.set('settingNotificationTimer', timeInSecs);
    },

    /**
     * <p>Updates the settings with the values from the URL shorteners section
     * of the options page.</p>
     * @requires jQuery
     * @private
     */
    saveUrlShorteners: function () {
        $('input[name="settingEnabledUrlShortener"]').each(function () {
            var radio = $(this);
            utils.set(radio.attr('id'), radio.is(':checked'));
        });
        utils.set('bitlyXApiKey', $('#bitlyXApiKey').val());
        utils.set('bitlyXLogin', $('#bitlyXLogin').val());
        utils.set('googleOAuthEnabled',
                $('#googleOAuthEnabled').is(':checked'));
    },

    /**
     * <p>Toggles the visibility of the content of the section that triggered
     * the event.</p>
     * @param {Event} [event] The event triggered.
     * @event
     * @requies jQuery
     * @private
     */
    toggleSection: function (event) {
        $(event.target).toggleClass('toggle-collapse toggle-expand')
                .next('.content').slideToggle();
    }

};