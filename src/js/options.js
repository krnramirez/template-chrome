/**
 * <p>Responsible for the options page.</p>
 * @author <a href="http://github.com/neocotic">Alasdair Mercer</a>
 * @since 0.0.2.1
 * @namespace
 */
var options = {

    /**
     * <p>The default locale to use if none were found matching in
     * {@link options.locales}.</p>
     * @since 0.1.0.0
     * @private
     * @type String
     */
    defaultLocale: 'en',

    /**
     * <p>The locales supported by this extension.</p>
     * @since 0.1.0.0
     * @private
     * @type Array
     */
    locales: ['en'],

    /**
     * <p>The regular expression used to validate feature name inputs.</p>
     * @see options.isNameValid
     * @since 0.1.0.0
     * @private
     * @type RegExp
     */
    rValidName: /^[A-Za-z0-9]+$/,

    /**
     * <p>The regular expression used to validate keyboard shortcut inputs.</p>
     * @see options.isShortcutValid
     * @since 0.1.0.0
     * @private
     * @type RegExp
     */
    rValidShortcut: /[A-Z0-9]/,

    /**
     * <p>The partial URL of Chrome extensions on the web store.</p>
     * @since 0.1.0.0
     * @private
     * @type String
     */
    webstoreUrl: 'https://chrome.google.com/webstore/detail/',

    /**
     * <p>Collapses the contents of all sections.</p>
     * @param {Event} [event] The event triggered.
     * @event
     * @requies jQuery
     * @private
     */
    collapseAll: function (event) {
        $('.section h4').addClass('toggle-expand')
                .removeClass('toggle-collapse').next('.contents').slideUp();
    },

    /**
     * <p>Creates a JSON string to export the features with the specified
     * names.</p>
     * @param {String[]} names The names of the features to export.
     * @returns {String} The JSON string generated containing the exported
     * values.
     * @since 0.2.0.0
     * @private
     */
    createExport: function (names) {
        var bg = chrome.extension.getBackgroundPage(),
            data = {
                templates: [],
                version: bg.urlcopy.version
            },
            opt = {};
        for (var i = 0; i < names.length; i++) {
            opt = $('#features option[value="' + names[i] + '"]');
            data.templates.push({
                enabled: opt.data('enabled') === 'true',
                image: parseInt(opt.data('image')),
                index: i,
                name: opt.val(),
                shortcut: opt.data('shortcut'),
                template: opt.data('template'),
                title: opt.text()
            });
        }
        return JSON.stringify(data);
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
                .removeClass('toggle-expand').next('.contents').slideDown();
    },

    /**
     * <p>Returns the information for the icon in the specified array with the
     * smallest dimensions.</p>
     * @param {Array} icons The icons to be queried.
     * @returns {IconInfo} The details of the smallest icon within the array
     * provided.
     * @since 0.1.0.0
     * @private
     */
    getSmallestIcon: function (icons) {
        var icon;
        for (var i = 0; i < icons.length; i++) {
            if (!icon || icons[i].size < icon.size) {
                icon = icons[i];
            }
        }
        return icon;
    },

    /**
     * <p>Replaces the value of the specified attribute of the selected
     * element(s) to the localized String looked up from Chrome.</p>
     * @param {String} selector A String containing a jQuery selector
     * expression to select the element(s) to be modified.
     * @param {String} attribute The name of the attribute to be modified.
     * @param {String} name The name of the localized message to be retrieved.
     * @param {String|String[]} [sub] The String(s) to substituted in the
     * returned message (where applicable).
     * @returns {jQuery} The modified element(s) wrapped in jQuery.
     * @since 0.1.0.0
     * @requires jQuery
     * @private
     */
    i18nAttribute: function (selector, attribute, name, sub) {
        if (typeof sub === 'string') {
            sub = [sub];
        }
        return $(selector).attr(attribute, chrome.i18n.getMessage(name, sub));
    },

    /**
     * <p>Replaces the inner HTML of the selected element(s) with the localized
     * String looked up from Chrome.</p>
     * @param {String} selector A String containing a jQuery selector
     * expression to select the element(s) to be modified.
     * @param {String} name The name of the localized message to be retrieved.
     * @param {String|String[]} [sub] The String(s) to substituted in the
     * returned message (where applicable).
     * @returns {jQuery} The modified element(s) wrapped in jQuery.
     * @since 0.1.0.0 - Previously located in {@link utils}.
     * @requires jQuery
     * @private
     */
    i18nReplace: function (selector, name, sub) {
        if (typeof sub === 'string') {
            sub = [sub];
        }
        return $(selector).html(chrome.i18n.getMessage(name, sub));
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
        options.i18nReplace('title, #options_hdr', 'opt_title');
        options.i18nReplace('#errors_hdr', 'opt_errors_header');
        options.i18nReplace('#add_btn', 'opt_add_button');
        options.i18nReplace('#delete_btn', 'opt_delete_button');
        options.i18nReplace('#import_btn', 'opt_import_button');
        options.i18nReplace('#export_btn', 'opt_export_button');
        options.i18nReplace('.export_con_stage1', 'confirm_export_stage1');
        options.i18nReplace('.export_con_stage2', 'confirm_export_stage2');
        options.i18nReplace('#features_hdr', 'opt_feature_header');
        options.i18nReplace('#feature_name_txt', 'opt_feature_name_text');
        options.i18nReplace('#feature_title_txt', 'opt_feature_title_text');
        options.i18nReplace('#feature_image_txt', 'opt_feature_image_text');
        options.i18nAttribute('a[rel=facebox]', 'title', 'opt_help_text');
        options.i18nAttribute('#feature_template', 'placeholder',
                'opt_feature_template_text');
        options.i18nReplace('#template_help_lnk', 'opt_feature_template_help');
        options.i18nReplace('#feature_enabled_txt',
                'opt_feature_enabled_text');
        options.i18nReplace('#shorteners_hdr', 'opt_url_shortener_header');
        options.i18nReplace('#shorteners_name_hdr',
                'opt_url_shortener_name_header');
        options.i18nReplace('#shorteners_enabled_hdr',
                'opt_url_shortener_enabled_header');
        options.i18nReplace('#shorteners_config_hdr',
                'opt_url_shortener_config_header');
        options.i18nReplace('#bitlyUsername_txt',
                'opt_url_shortener_username_text');
        options.i18nReplace('#bitlyApiKey_txt',
                'opt_url_shortener_api_key_text');
        options.i18nReplace('#googlOAuth_txt',
                'opt_url_shortener_oauth_enable_text');
        options.i18nReplace('#yourlsUrl_txt', 'opt_url_shortener_url_text');
        options.i18nReplace('#yourlsUsername_txt',
                'opt_url_shortener_username_text');
        options.i18nReplace('#yourlsPassword_txt',
                'opt_url_shortener_password_text');
        options.i18nReplace('#yourls_or_txt', 'opt_or_text');
        options.i18nReplace('#yourlsSignature_txt',
                'opt_url_shortener_signature_text');
        options.i18nReplace('#general_hdr', 'opt_general_header');
        options.i18nReplace('#contextMenu_txt', 'opt_context_menu_text');
        options.i18nReplace('#shortcuts_txt', 'opt_shortcut_text');
        options.i18nReplace('#anchors_hdr', 'opt_anchor_header');
        options.i18nReplace('#doAnchorTarget_txt', 'opt_anchor_target_text');
        options.i18nReplace('#doAnchorTitle_txt', 'opt_anchor_title_text');
        options.i18nReplace('#notifications_hdr', 'opt_notification_header');
        options.i18nReplace('#notifications_txt', 'opt_notification_text');
        options.i18nReplace('#notificationDuration_txt1',
                'opt_notification_timer_text1');
        options.i18nReplace('#notificationDuration_txt2',
                'opt_notification_timer_text2');
        options.i18nReplace('.save-btn', 'opt_save_button');
        options.i18nReplace('.expand-all-btn', 'opt_expand_all_button');
        options.i18nReplace('.collapse-all-btn', 'opt_collapse_all_button');
        options.i18nReplace('#footer', 'opt_footer',
                String(new Date().getFullYear()));
        // Inserts localized help/confirmation sections
        options.i18nReplace('#feature_enabled_help', 'help_feature_enabled');
        options.i18nReplace('#feature_image_help', 'help_feature_image');
        options.i18nReplace('#feature_name_help', 'help_feature_name');
        options.i18nReplace('#feature_shortcut_help', 'help_feature_shortcut');
        options.i18nReplace('#feature_title_help', 'help_feature_title');
        options.i18nReplace('#delete_con', 'confirm_delete');
        options.i18nReplace('#bitlyUsername_help', 'help_bitlyUsername');
        options.i18nReplace('#bitlyApiKey_help', 'help_bitlyApiKey');
        options.i18nReplace('#googlOAuth_help', 'help_googlOAuth');
        options.i18nReplace('#yourlsUrl_help', 'help_yourlsUrl');
        options.i18nReplace('#yourlsCredentials_help',
                'help_yourlsCredentials');
        options.i18nReplace('#yourlsSignature_help', 'help_yourlsSignature');
        /*
         * Binds options:collapseAll and options:expandAll events to the
         * buttons.
         */
        $('.collapse-all-btn').click(options.collapseAll);
        $('.expand-all-btn').click(options.expandAll);
        // Binds options:saveAndClose event to button
        $('.save-btn').click(options.saveAndClose);
        // Binds options:toggleSection to section headers
        $('.section h4').live('click', options.toggleSection);
        // Binds options:toggleTemplateSection to template section items
        $('.template-section').live('click', options.toggleTemplateSection);
        // Loads template section from locale-specific file
        var locale = options.defaultLocale,
            uiLocale = chrome.i18n.getMessage('@@ui_locale');
        for (var i = 0; i < options.locales.length; i++) {
            if (uiLocale === options.locales[i]) {
                locale = uiLocale;
                break;
            }
        }
        $('#template_help').load(chrome.extension.getURL('pages/templates_' +
                locale + '.html'), function () {
            $('.template-section:first-child').click();
        });
        // Loads current option values
        options.load();
        var bg = chrome.extension.getBackgroundPage(),
            keyMods = '';
        if (bg.urlcopy.isThisPlatform('mac')) {
            keyMods = bg.urlcopy.shortcutMacModifiers;
        } else {
            keyMods = bg.urlcopy.shortcutModifiers;
        }
        $('#feature_shortcut_txt').html(keyMods);
        // Initialize facebox
        $('a[rel*=facebox]').facebox();
    },

    /**
     * <p>Returns whether or not the specified name is available for use as a
     * feature.</p>
     * @param {String} name The name to be queried.
     * @returns {Boolean} <code>true</code> if the name is not already in use;
     * otherwise <code>false</code>.
     * @requires jQuery
     * @since 0.1.0.0
     * @private
     */
    isNameAvailable: function (name) {
        var available = true;
        $('#features option').each(function () {
            if ($(this).val() === name) {
                available = false;
                return false;
            }
        });
        return available;
    },

    /**
     * <p>Returns whether or not the specified name is valid for use as a
     * feature.</p>
     * @param {String} name The name to be tested.
     * @returns {Boolean} <code>true</code> if the name is valid; otherwise
     * <code>false</code>.
     * @since 0.1.0.0
     * @private
     */
    isNameValid: function (name) {
        return name.search(options.rValidName) !== -1;
    },

    /**
     * <p>Returns whether or not the specified keyboard shortcut is valid to
     * assign to a feature.</p>
     * @param {String} shortcut The keyboard shortcut to be tested.
     * @returns {Boolean} <code>true</code> if the shortcut is valid; otherwise
     * <code>false</code>.
     * @since 0.1.0.0
     * @private
     */
    isShortcutValid: function (shortcut) {
        return shortcut.search(options.rValidShortcut) !== -1;
    },

    /**
     * <p>Updates the options page with the values of the current settings.</p>
     * @requires jQuery
     */
    load: function () {
        options.loadImages();
        options.loadFeatures();
        options.loadNotifications();
        options.loadUrlShorteners();
        if (utils.get('contextMenu')) {
            $('#contextMenu').attr('checked', 'checked');
        } else {
            $('#contextMenu').removeAttr('checked');
        }
        if (utils.get('shortcuts')) {
            $('#shortcuts').attr('checked', 'checked');
        } else {
            $('#shortcuts').removeAttr('checked');
        }
        if (utils.get('doAnchorTarget')) {
            $('#doAnchorTarget').attr('checked', 'checked');
        } else {
            $('#doAnchorTarget').removeAttr('checked');
        }
        if (utils.get('doAnchorTitle')) {
            $('#doAnchorTitle').attr('checked', 'checked');
        } else {
            $('#doAnchorTitle').removeAttr('checked');
        }
    },

    /**
     * <p>Creates a <code>&lt;option/&gt;</code> for each image available for
     * features.</p>
     * <p>This is to be inserted in to the <code>&lt;select/&gt;</code>
     * containing feature images on the options page.</p>
     * @requires jQuery
     * @since 0.1.0.0
     * @private
     */
    loadImages: function () {
        var bg = chrome.extension.getBackgroundPage(),
            imagePreview = $('#feature_image_preview'),
            images = $('#feature_image');
        for (var i = 0; i < bg.urlcopy.images.length; i++) {
            opt = $('<option/>', {
                text: bg.urlcopy.images[i].name,
                value: bg.urlcopy.images[i].id
            }).appendTo(images).data('file', bg.urlcopy.images[i].file);
            if (bg.urlcopy.images[i].separate) {
                images.append(
                    $('<option/>', {
                        disabled: 'disabled',
                        text: '---------------'
                    })
                );
            }
        }
        images.change(function () {
            var opt = images.find('option:selected');
            imagePreview.attr({
                src: '../images/' + opt.data('file'),
                title: opt.text()
            });
        }).change();
    },

    /**
     * <p>Creates a <code>&lt;option/&gt;</code> representing the feature
     * provided.</p>
     * <p>This is to be inserted in to the <code>&lt;select/&gt;</code>
     * managing features on the options page.</p>
     * @param {Object} feature The information of the feature to be used.
     * @returns {jQuery} The <code>&lt;option/&gt;</code> element in a jQuery
     * wrapper.
     * @requires jQuery
     * @since 0.1.0.0
     * @private
     */
    loadFeature: function (feature) {
        var opt = $('<option/>', {
            text: feature.title,
            value: feature.name
        });
        opt.data('enabled', String(feature.enabled));
        opt.data('image', String(feature.image));
        opt.data('readOnly', String(feature.readOnly));
        opt.data('shortcut', feature.shortcut);
        opt.data('template', feature.template);
        return opt;
    },

    /**
     * <p>Updates the feature section of the options page with the current
     * settings.</p>
     * @requires jQuery
     * @private
     */
    loadFeatures: function () {
        // TODO: Tidy function by splitting it up
        var bg = chrome.extension.getBackgroundPage(),
            features = $('#features'),
            lastSelectedFeature = {};
        // Ensures clean slate
        features.find('option').remove();
        // Creates and inserts options representing features
        for (var i = 0; i < bg.urlcopy.features.length; i++) {
            features.append(options.loadFeature(bg.urlcopy.features[i]));
        }
        /*
         * Whenever the selected option changes we want all the controls to
         * represent the current selection (where possible).
         */
        features.change(function (event) {
            var $this = $(this),
                opt = $this.find('option:selected');
            if (lastSelectedFeature.length) {
                options.updateFeature(lastSelectedFeature);
            }
            // Disables all the controls as no option is selected
            if (opt.length === 0) {
                lastSelectedFeature = {};
                options.i18nReplace('#add_btn', 'opt_add_button');
                $('#moveUp_btn, #moveDown_btn, .toggle-feature')
                        .attr('disabled', 'disabled');
                $('.read-only, .read-only-always').removeAttr('disabled');
                $('.read-only, .read-only-always').removeAttr('readonly');
                $('#delete_btn').attr('disabled', 'disabled');
                $('#feature_enabled').attr('checked', 'checked');
                $('#feature_image option').first().attr('selected',
                        'selected');
                $('#feature_image').change();
                $('#feature_name').val('');
                $('#feature_shortcut').val('');
                $('#feature_template').val('');
                $('#feature_title').val('');
            } else {
                lastSelectedFeature = opt;
                options.i18nReplace('#add_btn', 'opt_add_new_button');
                $('.read-only-always').attr('disabled', 'disabled');
                $('.read-only-always').attr('readonly', 'readonly');
                $('.toggle-feature').removeAttr('disabled');
                // Disables 'up' control as option is at top of the list
                if (opt.is(':first-child')) {
                    $('#moveUp_btn').attr('disabled', 'disabled');
                } else {
                    $('#moveUp_btn').removeAttr('disabled');
                }
                // Disables 'down' control as option is at bottom of the list
                if (opt.is(':last-child')) {
                    $('#moveDown_btn').attr('disabled', 'disabled');
                } else {
                    $('#moveDown_btn').removeAttr('disabled');
                }
                // Updates fields and controls to reflect selected feature
                var imgOpt = $('#feature_image option[value="' +
                        opt.data('image') + '"]');
                if (imgOpt.length === 0) {
                    $('#feature_image option').first().attr('selected',
                            'selected');
                } else {
                    imgOpt.attr('selected', 'selected');
                }
                $('#feature_image').change();
                $('#feature_name').val(opt.val());
                $('#feature_shortcut').val(opt.data('shortcut'));
                $('#feature_template').val(opt.data('template'));
                $('#feature_title').val(opt.text());
                if (opt.data('enabled') === 'true') {
                    $('#feature_enabled').attr('checked', 'checked');
                } else {
                    $('#feature_enabled').removeAttr('checked');
                }
                if (opt.data('readOnly') === 'true') {
                    $('.read-only').attr('disabled', 'disabled');
                    $('.read-only').attr('readonly', 'readonly');
                } else {
                    $('.read-only').removeAttr('disabled');
                    $('.read-only').removeAttr('readonly');
                }
            }
            /*
             * Ensures correct arrows display in 'up'/'down' controls depending
             * on whether or not the controls are disabled.
             */
            $('#moveDown_btn:not([disabled]) img').attr('src',
                    '../images/move_down.gif');
            $('#moveUp_btn:not([disabled]) img').attr('src',
                    '../images/move_up.gif');
            $('#moveDown_btn[disabled] img').attr('src',
                    '../images/move_down_disabled.gif');
            $('#moveUp_btn[disabled] img').attr('src',
                    '../images/move_up_disabled.gif');
        }).change();
        // Adds a new feature to options based on input values
        $('#add_btn').click(function (event) {
            var opt = features.find('option:selected');
            if (opt.length) {
                features.val([]);
                features.change();
                $('#feature_name').focus();
            } else {
                var name = $('#feature_name').val().trim(),
                    title = $('#feature_title').val().trim();
                $('#errors').find('li').remove();
                opt = options.loadFeature({
                    enabled: String($('#feature_enabled').is(':checked')),
                    image: parseInt($('#feature_image option:selected').val()),
                    name: name,
                    readOnly: false,
                    shortcut: $('#feature_shortcut').val().trim()
                            .toUpperCase(),
                    template: $('#feature_template').val(),
                    title: title
                });
                if (options.validateFeature(opt, true)) {
                    features.append(opt);
                    opt.attr('selected', 'selected');
                    features.change().focus();
                } else {
                    $.facebox({div: '#message'});
                }
            }
        });
        // Removes selected unprotected feature
        $('#delete_btn').click(function (event) {
            $.facebox({div: '#delete_con'});
        });
        $('.delete_no_btn').live('click', function (event) {
            $(document).trigger('close.facebox');
        });
        $('.delete_yes_btn').live('click', function (event) {
            var opt = $('#features option:selected');
            if (opt.data('readOnly') !== 'true') {
                opt.remove();
                features.change().focus();
            }
            $(document).trigger('close.facebox');
        });
        // Supports import process
        $('#import_btn').click(function (event) {
            options.updateFeature($('#features option:selected'));
            $('.import_con_stage1').show();
            $('.import_con_stage2, .import_con_stage3').hide();
            $('.import_content').val('');
            $('.import_error').text('').hide();
            $.facebox({div: '#import_con'});
        });
        $('.import_file_btn').live('change', function (event) {
            // TODO: Test
            var $this = $(this),
                file = event.target.files[0],
                reader = new FileReader();
            reader.onerror = function (evt) {
                // TODO: i18n
                var message = '';
                switch (evt.target.error.code) {
                case evt.target.error.NOT_FOUND_ERR:
                    message = 'Could not find file!';
                    break;
                case evt.target.error.ABORT_ERR:
                    message = 'Aborted!';
                    break;
                default:
                    message = 'Unable to read file!';
                };
                $('.import_error').text(message).show();
            };
            reader.onload = function (evt) {
                try {
                    JSON.parse(evt.target.result);
                    $('.import_error').text('').hide();
                    $('.import_content').val(evt.target.result);
                } catch (e) {
                    $('.import_content').val('');
                    $('.import_error').text('Invalid file!').show();
                }
            };
            reader.readAsText(file);
        });
        $('.import_no_btn, .import_close_btn').live('click', function (event) {
            $(document).trigger('close.facebox');
        });
        $('.import_yes_btn').live('click', function (event) {
            // TODO: Code
            // readImport($('.import_error').val());
            // If errors, show them...
            // Otherwise, load templates in to list and let user pick those to import
            // Then load in new settings, validating as you go and never overwriting read-only values
        });
        // Supports export process
        $('.export_con_list [name="export_templates"]').live('change',
                function (event) {
                    var checkedItems = $(this).parents('.export_con_list')
                            .find('[name="export_templates"]:checked');
                    if (checkedItems.length > 0) {
                        $('.export_yes_btn').removeAttr('disabled');
                    } else {
                        $('.export_yes_btn').attr('disabled', 'disabled');
                    }
                });
        $('#export_btn').click(function (event) {
            var list = $('.export_con_list');
            list.find('li').remove();
            options.updateFeature($('#features option:selected'));
            $('.export_yes_btn').attr('disabled', 'disabled');
            $('.export_con_stage1').show();
            $('.export_con_stage2').hide();
            $('.export_content').val('');
            features.find('option').each(function () {
                var opt = $(this),
                    optEnabled = opt.data('enabled') === 'true';
                $('<li/>').append(
                    $('<label/>').append(
                        $('<input/>', {
                            name: 'export_templates',
                            type: 'checkbox',
                            value: opt.val()
                        }),
                        $('<span/>', {
                            style: optEnabled ? '' : 'font-style: italic',
                            text: opt.text()
                        })
                    )
                ).appendTo(list);
            });
            $.facebox({div: '#export_con'});
        });
        $('.export_deselect_all_btn').live('click', function (event) {
            $('.export_con_list [name="export_templates"]')
                    .removeAttr('checked');
            $('.export_yes_btn').attr('disabled', 'disabled');
        });
        $('.export_select_all_btn').live('click', function (event) {
            $('.export_con_list [name="export_templates"]').attr('checked',
                    'checked');
            $('.export_yes_btn').removeAttr('disabled');
        });
        $('.export_no_btn, .export_close_btn').live('click', function (event) {
            $(document).trigger('close.facebox');
        });
        $('.export_yes_btn').live('click', function (event) {
            var $this = $(this).attr('disabled', 'disabled'),
                items = $this.parents('.export_con_stage1')
                        .find('.export_con_list [name="export_templates"]'),
                names = [];
            items.filter(':checked').each(function () {
                names.push($(this).val());
            });
            $('.export_content').val(options.createExport(names));
            $('.export_con_stage1').hide();
            $('.export_con_stage2').show();
        });
        $('.export_save_btn').live('click', function (event) {
            /*
             * TODO: Is there a better way of doing this?
             * 
             * - Can't suggest file name!
             * - Will text/csv ALWAYS be saved?
             */
            var str = $(this).parents('.export_con_stage2')
                    .find('.export_content').val();
            window.location = 'data:text/csv;charset=utf8,' +
                    encodeURIComponent(str);
        });
        /*
         * Moves the selected option down one when the 'down' control is
         * clicked.
         */
        $('#moveDown_btn').click(function (event) {
            var opt = features.find('option:selected');
            opt.insertAfter(opt.next());
            features.change().focus();
        });
        // Moves the selected option up one when the 'up' control is clicked
        $('#moveUp_btn').click(function (event) {
            var opt = features.find('option:selected');
            opt.insertBefore(opt.prev());
            features.change().focus();
        });
        /*
         * Updates the 'enabled' data bound to the selected option when the
         * checkbox control is clicked.
         */
        $('#feature_enabled').click(function (event) {
            $('#features option:selected').data('enabled',
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
        if (utils.get('notifications')) {
            $('#notifications').attr('checked', 'checked');
        } else {
            $('#notifications').removeAttr('checked');
        }
        var timeInSecs = 0;
        if (utils.get('notificationDuration') > timeInSecs) {
            timeInSecs = utils.get('notificationDuration') / 1000;
        }
        // Ensures clean slate
        $('#notificationDuration option').remove();
        // Creates and inserts options for available auto-hide time in seconds
        for (var i = 0; i <= 30; i++) {
            var opt = $('<option/>', {
                text: i,
                value: i
            });
            if (i === timeInSecs) {
                opt.attr('selected', 'selected');
            }
            opt.appendTo('#notificationDuration');
        }
    },

    /**
     * <p>Updates the URL shorteners section of the options page with the
     * current settings.</p>
     * @requires jQuery
     * @private
     */
    loadUrlShorteners: function () {
        $('input[name="enabled_shortener"]').each(function () {
            var radio = $(this);
            if (utils.get(radio.attr('id'))) {
                radio.attr('checked', 'checked');
            }
        });
        $('#bitlyApiKey').val(utils.get('bitlyApiKey'));
        $('#bitlyUsername').val(utils.get('bitlyUsername'));
        if (utils.get('googlOAuth')) {
            $('#googlOAuth').attr('checked', 'checked');
        } else {
            $('#googlOAuth').removeAttr('checked');
        }
        $('#yourlsPassword').val(utils.get('yourlsPassword'));
        $('#yourlsSignature').val(utils.get('yourlsSignature'));
        $('#yourlsUrl').val(utils.get('yourlsUrl'));
        $('#yourlsUsername').val(utils.get('yourlsUsername'));
    },

    /**
     * <p>Updates the settings with the values from the options page.</p>
     * @requires jQuery
     */
    save: function () {
        utils.set('contextMenu', $('#contextMenu').is(':checked'));
        utils.set('shortcuts', $('#shortcuts').is(':checked'));
        utils.set('doAnchorTarget', $('#doAnchorTarget').is(':checked'));
        utils.set('doAnchorTitle', $('#doAnchorTitle').is(':checked'));
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
        options.updateFeature($('#features option:selected'));
        if (options.validateFeatures()) {
            options.save();
            chrome.tabs.getSelected(null, function (tab) {
                chrome.tabs.remove(tab.id);
            });
        } else {
            $.facebox({div: '#message'});
        }
    },

    /**
     * <p>Updates the settings with the values from the feature section of the
     * options page.</p>
     * @requires jQuery
     * @private
     */
    saveFeatures: function () {
        var bg = chrome.extension.getBackgroundPage(),
            features = [];
        /*
         * Updates each individual feature settings based on their
         * corresponding options.
         */
        $('#features option').each(function (index) {
            var opt = $(this);
            features.push({
                enabled: opt.data('enabled') === 'true',
                image: parseInt(opt.data('image')),
                index: index,
                name: opt.val(),
                readOnly: opt.data('readOnly') === 'true',
                shortcut: opt.data('shortcut'),
                template: opt.data('template'),
                title: opt.text()
            });
        });
        // Ensures features data reflects the updated settings
        bg.urlcopy.saveFeatures(features);
        bg.urlcopy.updateFeatures();
    },

    /**
     * <p>Updates the settings with the values from the notification section of
     * the options page.</p>
     * @requires jQuery
     * @private
     */
    saveNotifications: function () {
        utils.set('notifications', $('#notifications').is(':checked'));
        var timeInSecs = $('#notificationDuration').val();
        timeInSecs = (timeInSecs) ? parseInt(timeInSecs, 10) * 1000 : 0;
        utils.set('notificationDuration', timeInSecs);
    },

    /**
     * <p>Updates the settings with the values from the URL shorteners section
     * of the options page.</p>
     * @requires jQuery
     * @private
     */
    saveUrlShorteners: function () {
        $('input[name="enabled_shortener"]').each(function () {
            var $this = $(this);
            utils.set($this.attr('id'), $this.is(':checked'));
        });
        utils.set('bitlyApiKey', $('#bitlyApiKey').val().trim());
        utils.set('bitlyUsername', $('#bitlyUsername').val().trim());
        utils.set('googlOAuth', $('#googlOAuth').is(':checked'));
        utils.set('yourlsPassword', $('#yourlsPassword').val());
        utils.set('yourlsSignature', $('#yourlsSignature').val().trim());
        utils.set('yourlsUrl', $('#yourlsUrl').val().trim());
        utils.set('yourlsUsername', $('#yourlsUsername').val().trim());
    },

    /**
     * <p>Toggles the visibility of the content of the section that triggered
     * the event.</p>
     * @param {Event} [event] The event triggered.
     * @event
     * @requires jQuery
     * @private
     */
    toggleSection: function (event) {
        $(this).toggleClass('toggle-collapse toggle-expand')
                .next('.contents').slideToggle();
    },

    /**
     * <p>Toggles the visibility of the content of the template section that
     * triggered the event.</p>
     * @param {Event} [event] The event triggered.
     * @event
     * @since 0.1.0.0
     * @requires jQuery
     * @private
     */
    toggleTemplateSection: function (event) {
        var $this = $(this),
            table = $this.parents('.template-table');
        table.find('.template-section.selected').removeClass('selected');
        table.find('.template-display').html($this.addClass('selected')
                .next('.template-content').html()).scrollTop(0);
    },

    /**
     * <p>Updates the specified &lt;option&gt; element that represents a
     * feature with values taken from the available fields.</p>
     * @param {jQuery} opt The jQuery wrapped &lt;option&gt; to be
     * updated.
     * @since 0.1.0.3
     * @requires jQuery
     * @private
     */
    updateFeature: function (opt) {
        if (opt.length) {
            opt.data('enabled', String($('#feature_enabled').is(':checked')));
            opt.data('image', $('#feature_image option:selected').val());
            opt.data('shortcut',
                    $('#feature_shortcut').val().trim().toUpperCase());
            opt.data('template', $('#feature_template').val());
            opt.text($('#feature_title').val().trim());
            opt.val($('#feature_name').val().trim());
            return opt;
        }
    },

    /**
     * <p>Validates the specified &lt;option&gt; element that represents a
     * feature.</p>
     * <p>If an array of keyboard shortcuts is also provided then this function
     * will validate whether or not the shortcut of the feature being validated
     * is already in use.</p>
     * <p>This function adds any validation errors it encounters to a unordered
     * list which should be displayed to the user at some point if
     * <code>true</code> is returned.</p>
     * @param {jQuery} feature The jQuery wrapped &lt;option&gt; to be
     * validated.
     * @param {Boolean} isNew <code>true</code> if the feature has yet to be
     * added; otherwise <code>false</code>.
     * @param {Array} [usedShortcuts] The array of keyboard shortcuts already
     * in use.
     * @returns {Boolean} <code>true</code> if validation errors were
     * encountered; otherwise <code>false</code>.
     * @requires jQuery
     * @since 0.1.0.0
     * @private
     */
    validateFeature: function (feature, isNew, usedShortcuts) {
        var errors = $('#errors'),
            name = feature.val().trim(),
            shortcut = feature.data('shortcut').trim(),
            title = feature.text().trim();
        function createError(name) {
            return $('<li/>', {
                html: chrome.i18n.getMessage(name)
            }).appendTo(errors);
        }
        if (feature.data('readOnly') !== 'true') {
            if (isNew) {
                if (!options.isNameValid(name)) {
                    createError('opt_feature_name_invalid');
                } else if (!options.isNameAvailable(name)) {
                    createError('opt_feature_name_unavailable');
                }
            }
            if (title.length === 0) {
                createError('opt_feature_title_invalid');
            }
        }
        if (shortcut && typeof usedShortcuts !== 'undefined') {
            if (!options.isShortcutValid(shortcut)) {
                createError('opt_feature_shortcut_invalid');
            } else if (usedShortcuts.indexOf(shortcut) !== -1) {
                createError('opt_feature_shortcut_unavailable');
            }
        }
        return errors.find('li').length === 0;
    },

    /**
     * <p>Validates all &lt;option&gt; elements that represent features that
     * are to be stored in localStorage.</p>
     * <p>This function adds any validation errors it encounters to a unordered
     * list which should be displayed to the user at some point if
     * <code>true</code> is returned.</p>
     * @returns {Boolean} <code>true</code> if validation errors were
     * encountered; otherwise <code>false</code>.
     * @requires jQuery
     * @since 0.1.0.0
     * @private
     */
    validateFeatures: function () {
        var errors = $('#errors'),
            features = $('#features option'),
            usedShortcuts = [];
        errors.find('li').remove();
        features.each(function () {
            var $this = $(this);
            if (options.validateFeature($this, false, usedShortcuts)) {
                usedShortcuts.push($this.data('shortcut').trim());
            } else {
                $this.attr('selected', 'selected');
                $('#features').change().focus();
                return false;
            }
        });
        return errors.find('li').length === 0;
    }

};