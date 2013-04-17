/**
    @module ui/video-control.reel/video-control-track.reel
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage;
var AbstractInputRange = require("montage/ui/base/abstract-input-range").AbstractInputRange;
var Promise = require("montage/core/promise").Promise;

/**
    Description TODO
    @class VideoControlTrack
    @extends Component
*/
exports.VideoControlTrack = Montage.create(AbstractInputRange, /** @lends VideoControlTrack# */ {

    // Lifecycle

    /**
     * @private
     */
    didCreate: {
        value: function () {
            AbstractInputRange.didCreate.call(this);
            this.addOwnPropertyChangeListener("time", this);

//            this.defineBinding("value", {"<->": "controller.position", source: this});
            this.defineBinding("max", {"<-": "controller.duration", source: this});
            this.defineBinding("time", {"<-": "controller.position", source: this});

        }
    },

    // Event Listeners

    handleThumbTranslateStart: {
        value: function (e) {
            AbstractInputRange.handleThumbTranslateStart.apply(this, arguments);
            if(this.controller.status === this.controller.PLAYING ) {
                this._wasPlaying = true;
                this.controller.pause();
            } else {
                this._wasPlaying = false;
            }
        }
    },

    handleThumbTranslate: {
        value: function (event) {
            AbstractInputRange.handleThumbTranslate.apply(this, arguments);

        }
    },

    handleThumbTranslateEnd: {
        value: function (e) {
            AbstractInputRange.handleThumbTranslateEnd.apply(this, arguments);
            if ( this._wasPlaying ) {
                this.controller.play();
            }
        }
    },


    // Elements for AbstractInputRange

    _thumbSliderElement: {
        value: null
    },

    _inputRangeThumbElement: {
        value: null
    },

    // Properties

    time: {
        value: 0
    },

    formattedTime: {
        value: 0
    },

    controller: {
        value: null
    },

    // Machinery

    handleTimeChange: {
        value: function(changeValue, key, object) {
            this.formattedTime = this._prettyTime(this.time);
        }
    },

    _wasPlaying: {
        value: false
    },

    _prettyTime: {
        value: function(time) {

            var sec, min, hour;
            time = parseInt(time, 10);
            if (isNaN(time) || time < 0) {
                return "";
            }
            sec = time % 60;
            min = Math.floor(time / 60) % 60;
            hour = Math.floor(time / 3600);
            return (hour > 0 ? hour + ":" : "") + (min < 10 ? min : min) + ":" + (sec < 10 ? "0"+sec : sec);
        }
    }

});