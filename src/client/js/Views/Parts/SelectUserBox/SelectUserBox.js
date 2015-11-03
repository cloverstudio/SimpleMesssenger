var Backbone = require('backbone');
var _ = require('lodash');

var Utils = require('../../../lib/utils');
var Const = require('../../../lib/consts');
var Config = require('../../../lib/init');

var SearchUserClient = require('../../../lib/APIClients/SearchUserClient');
var LoginUserManager = require('../../../lib/loginUserManager');
var User = require('../../../Models/user');


// load template
var template = require('./SelectUserBox.hbs');
var templateUserList = require('./UserList.hbs');
var templateUserListEmpty = require('./UserListEmpty.hbs');
var templateSelectedUserList = require('./SelectedUserList.hbs');


var SelectUserBox = Backbone.View.extend({
    
    label : Utils.l10n("Select users : "),
    parentElement : null,
    lastKeyword : '',
    collectionUsersCandidates: null,
    collectionUsersSelected: null,
    currentSelectedIndexByArrowKeys : -1,
    listener: null,
    initialize: function(options) {
        this.parentElement = options.el;
        this.listener = options.listener
        this.render();
    },

    render: function() {
        
        var self = this;
        
        $(this.parentElement).html(template({
            label: self.label
        }));

        this.onLoad();

        return this;


    },

    onLoad: function(){

        var self = this;

        this.collectionUsersSelected = new User.Collection([]);

        // Dropdown events
        $(this.parentElement + ' #select-user-box-dropdown').on('hide.bs.dropdown', function () {
            self.lastKeyword = "";
        });

        this.resetTextBox();

    },

    resetTextBox: function(){

        var self = this;
                
        $(this.parentElement + " #select-user-box-input").unbind().on('keyup',function(e){
            
            console.log('sss');
            
            var keyword = $(this).val();

            if(self.lastKeyword.length == 0 && keyword.length > 0){

                // show candidates
                if(!$(self.parentElement + ' #select-user-box-dropdown .dropdown-menu').is(":visible")){
                    $(self.parentElement + ' #select-user-box-dropdown button').trigger('click.bs.dropdown');
                }

            }

            if(self.lastKeyword.length > 0 && keyword.length == 0){

                // show candidates
                if($(self.parentElement + ' #select-user-box-dropdown .dropdown-menu').is(":visible")){
                    $(self.parentElement + ' #select-user-box-dropdown button').trigger('click.bs.dropdown');
                }

            }


            if (self.lastKeyword.length == 0 && e.keyCode == 8) {

                // delete last user
                self.collectionUsersSelected.pop();
                self.renderSelectedUsers();

                return;
            }

            // up arrow
            if (e.keyCode == 38) {

                self.dropboxSelectPrev();
                return;
            }

            // down arrow
            if (e.keyCode == 40) {

                self.dropboxSelectNext();

                return;
            }

            if (e.keyCode == 13) {

                if($(this).val().length == 0){

                    if(self.listener){

                        self.listener(self.collectionUsersSelected);

                    }

                }

                // search selected
                if($(self.parentElement + ' #select-user-box-dropdown ul li.selected').length > 0){

                    var userId = $(self.parentElement + ' #select-user-box-dropdown ul li.selected').attr('userid');
                    var candidate = self.collectionUsersCandidates.where({id:userId});

                    if(candidate.length > 0)
                        self.addUser(candidate[0].get('id'));

                } else {

                    // add first user of dropdown
                    if(keyword.length > 0 && self.collectionUsersCandidates.length > 0){
                        var firstCnadidate = self.collectionUsersCandidates.at(0);
                        self.addUser(firstCnadidate.get('id'));
                    }

                }

                if(self.collectionUsersCandidates.length == 0)
                    $(this).val('');



                return;
            }

            SearchUserClient.send(keyword,function(res){

                self.collectionUsersCandidates =  new User.Collection([]);

                _.forEach(res.result.users,function(row){

                    var isExists = false;

                    self.collectionUsersSelected.forEach(function(rowSelected){

                        if(rowSelected.get('id') == row._id)
                            isExists = true;

                    });

                    if(row._id == LoginUserManager.getUser().get('id'))
                        isExists = true;

                    if(!isExists)
                        self.collectionUsersCandidates.add(User.modelByResult(row));

                });

                if(self.collectionUsersCandidates.length > 0){
                    var html = templateUserList({list:self.collectionUsersCandidates.toJSON()});
                    $(self.parentElement + ' #select-user-box-dropdown ul').html(html);
                } else {
                    var html = templateUserListEmpty({list:self.collectionUsersCandidates.toJSON()});
                    $(self.parentElement + ' #select-user-box-dropdown ul').html(html);
                }

                $(self.parentElement + ' #select-user-box-dropdown ul li a').unbind().on('click',function(){

                    var userId = $(this).attr('userid');
                    self.addUser(userId);

                });

            });

            self.lastKeyword = keyword;

        });

        $(this.parentElement + " #select-user-box-input").focus();


    },

    addUser : function(userId){

        var modelUser = this.collectionUsersCandidates.where({id:userId});
        this.collectionUsersSelected.add(modelUser);

        this.renderSelectedUsers();

    },

    renderSelectedUsers: function(){

        var html = templateSelectedUserList({list:this.collectionUsersSelected.toJSON()});
        $(this.parentElement + ' #select-user-selected-users').html(html);

        if($(this.parentElement + ' #select-user-box-dropdown .dropdown-menu').is(":visible")){
            $(this.parentElement + ' #select-user-box-dropdown button').trigger('click.bs.dropdown');
        }

        this.currentSelectedIndexByArrowKeys = -1;
        $(this.parentElement + ' #select-user-box-dropdown .dropdown-menu').scrollTop(0);
        this.resetTextBox();

    },

    dropboxSelectNext: function(){

        if(!$(this.parentElement + ' #select-user-box-dropdown .dropdown-menu').is(":visible"))
            return;

        if(this.currentSelectedIndexByArrowKeys < this.collectionUsersCandidates.length - 1){

            this.currentSelectedIndexByArrowKeys++;

            $(this.parentElement + ' #select-user-box-dropdown ul li').removeClass('selected');
            $(this.parentElement + ' #select-user-box-dropdown ul li').eq(this.currentSelectedIndexByArrowKeys).addClass('selected');
        }

        this.setScrollStateOfDropDown();

    },

    dropboxSelectPrev: function(){

        if(!$(this.parentElement + ' #select-user-box-dropdown .dropdown-menu').is(":visible"))
            return;

        if(this.currentSelectedIndexByArrowKeys > 0){

            this.currentSelectedIndexByArrowKeys--;

            $(this.parentElement + ' #select-user-box-dropdown ul li').removeClass('selected');
            $(this.parentElement + ' #select-user-box-dropdown ul li').eq(this.currentSelectedIndexByArrowKeys).addClass('selected');
        }

        this.setScrollStateOfDropDown();
    },

    setScrollStateOfDropDown: function(){
        var selectedPosition = $(this.parentElement + ' #select-user-box-dropdown ul li.selected').offset().top + $(this.parentElement + ' #select-user-box-dropdown .dropdown-menu').scrollTop();
        var dropDownHeight = $(this.parentElement + ' #select-user-box-dropdown .dropdown-menu').height();

        if(selectedPosition > dropDownHeight)
            $(this.parentElement + ' #select-user-box-dropdown .dropdown-menu').scrollTop(selectedPosition - dropDownHeight - 25);

    },
    
    getSelectedUsers : function(){
        
        return this.collectionUsersSelected;
        
    }


});

module.exports = SelectUserBox;
