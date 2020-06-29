/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    if (!CKEDITOR.stylesSet.registered.hasOwnProperty('my_styles')) {
        CKEDITOR.stylesSet.add('my_styles', [
            // Block-level styles
            {name: 'Article Block', element: 'article', attributes: {'class': 'featured-article'}},
            {name: 'Article  Sub Title', element: 'h4', attributes: {'class': 'article-title'}},
            {name: 'Clear block', element: 'div', attributes: {'class': 'clearfix'}},

            //Photo Styles
            {name: 'Photo Block', element: 'div', attributes: {'class': 'photo-block'}},
            {name: 'Photo Name', element: 'span', attributes: {'class': 'slider-panel'}},

            //List Styles
            {name: 'Article List', element: 'ul', attributes: {'class': 'article-list'}}
        ]);
        config.stylesSet = 'my_styles';
    }
    config.contentsCss = ['/static/css/styles.css', '/static/css/fonts.css', '/static/bootstrap/css/bootstrap.min.css'];
    config.font_names = 'Cabin/Cabin Condensed; Marine/Marine;Blenda Script/Blenda Script;Courgette/Courgette;Delius/Delius;Satisfy/Satisfy;Short Stack/ShortStack;Bahij Palatino Sans Arabic/Bahij Palatino Sans Arabic;Baloo Bhaijaan/BalooBhaijaan;Iranian Sans/Iranian Sans;XB Kayhan/XB Kayhan;XB Titre/XB Titre;XB Titre Shadow/XB Titre Shadow;' + config.font_names;
};
