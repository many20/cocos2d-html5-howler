/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var cc = cc || {};

/**
 * Offer a VERY simple interface to play music & sound effect.
 * @class
 * @extends   cc.Class
 */
cc.HowlerAudioEngine = cc.AudioEngine.extend(/** @lends cc.AudioEngine# */{

    /**
     * Constructor
     */
    ctor:function () {
        this._super();
    },

    /**
     * Initialize sound type
     * @return {Boolean}
     */
    init:function () {
        return this._super();
    },

    /**
     * Preload music resource.<br />
     * This method is called when cc.Loader preload  resources.
     * @param {String} path The path of the music file with filename extension.
     */
    preloadSound:function (path) {
        if (this._soundEnable) {
            var extName = this._getExtFromFullPath(path);
            var keyname = this._getPathWithoutExt(path);
            if (this._checkAudioFormatSupported(extName) && !this._soundList.hasOwnProperty(keyname)) {
                var soundCache = new Howl({
                    urls: [path]
                });

                this._soundList[keyname] = true;
            }
        }
        cc.Loader.getInstance().onResLoaded();
    },

    /**
     * Play music.
     * @param {String} path The path of the music file without filename extension.
     * @param {Boolean} loop Whether the music loop or not.
     * @example
     * //example
     * cc.AudioEngine.getInstance().playMusic(path, false);
     */
    playMusic:function (path, loop) {
        var keyname = this._getPathWithoutExt(path);
        var actExt = this._supportedFormat[0];

        var au;
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].pause();
        }
        this._playingMusic = keyname;

        if (this._muiscList.hasOwnProperty(keyname)) {
            au = this._muiscList[keyname];
        } else {
            au = new Howl({
                    urls: [keyname + "." + actExt]
            });
            this._muiscList[keyname] = au;
        }

        if (loop) {
            au.loop(loop);
        }
        au.play();
        this._isMusicPlaying = true;
    },

    /**
     * Stop playing music.
     * @param {Boolean} releaseData If release the music data or not.As default value is false.
     * @example
     * //example
     * cc.AudioEngine.getInstance().stopMusic();
     */
    stopMusic:function (releaseData) {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].loop(false).stop();
            this._isMusicPlaying = false;
            if (releaseData) {
                delete this._muiscList[this._playingMusic];
            }
        }
    },

    /**
     * Pause playing music.
     * @example
     * //example
     * cc.AudioEngine.getInstance().pauseMusic();
     */
    pauseMusic:function () {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].pause();
            this._isMusicPlaying = false;
        }
    },

    /**
     * Resume playing music.
     * @example
     * //example
     * cc.AudioEngine.getInstance().resumeMusic();
     */
    resumeMusic:function () {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].play();
            this._isMusicPlaying = true;
        }
    },

    /**
     * Rewind playing music.
     * @example
     * //example
     * cc.AudioEngine.getInstance().rewindMusic();
     */
    rewindMusic:function () {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            this._muiscList[this._playingMusic].stop().play();
            this._isMusicPlaying = true;
        }
    },

    /**
     * The volume of the music max value is 1.0,the min value is 0.0 .
     * @return {Number}
     * @example
     * //example
     * var volume = cc.AudioEngine.getInstance().getMusicVolume();
     */
    getMusicVolume:function () {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            return this._muiscList[this._playingMusic].volume();
        }
        return 0;
    },

    /**
     * Set the volume of music.
     * @param {Number} volume Volume must be in 0.0~1.0 .
     * @example
     * //example
     * cc.AudioEngine.getInstance().setMusicVolume(0.5);
     */
    setMusicVolume:function (volume) {
        if (this._muiscList.hasOwnProperty(this._playingMusic)) {
            var music = this._muiscList[this._playingMusic];
            if (volume > 1) {
                music.volume(1);
            } else if (volume < 0) {
                music.volume(0);
            } else {
                music.volume(volume);
            }
        }
    },

    /**
     * Play sound effect.
     * @param {String} path The path of the sound effect with filename extension.
     * @param {Boolean} loop Whether to loop the effect playing, default value is false
     * @example
     * //example
     * var soundId = cc.AudioEngine.getInstance().playEffect(path);
     */
    playEffect:function (path, loop) {
        var keyname = this._getPathWithoutExt(path);
        var actExt = this._supportedFormat[0];

        var au;
        if (this._effectList.hasOwnProperty(keyname)) {
            au = this._effectList[keyname];
        } else {
            au = new Howl({
                    urls: [keyname + "." + actExt]
            });
            this._effectList[keyname] = au;
        }

        //to prevent a bug. when one effect plays in a loop,
        //no effect of the same type can play at the same time
        if (au.loop()) {
            return keyname;
        }

        if (loop) {
            au.loop(loop);
        }
        au.play();
        return keyname;
    },

    /**
     * Set the volume of sound effecs.
     * @param {Number} volume Volume must be in 0.0~1.0 .
     * @example
     * //example
     * cc.AudioEngine.getInstance().setEffectsVolume(0.5);
     */
    setEffectsVolume:function (volume) {
        if (volume > 1) {
            this._effectsVolume = 1;
        }
        else if (volume < 0) {
            this._effectsVolume = 0;
        }
        else {
            this._effectsVolume = volume;
        }

        for (var key in this._effectList) {
            if (this._effectList.hasOwnProperty(key)) {
                this._effectList[key].volume(volume);
            }
        }
    },

    /**
     * Pause playing sound effect.
     * @param {String} path The return value of function playEffect.
     * @example
     * //example
     * cc.AudioEngine.getInstance().pauseEffect(path);
     */
    pauseEffect:function (path) {
        var keyname = this._getPathWithoutExt(path);
        if (this._effectList.hasOwnProperty(keyname)) {
            this._effectList[keyname].loop(false).pause();
        }
    },

    /**
     * Pause all playing sound effect.
     * @example
     * //example
     * cc.AudioEngine.getInstance().pauseAllEffects();
     */
    pauseAllEffects:function () {
        for (var key in this._effectList) {
            if (this._effectList.hasOwnProperty(key)) {
                this._effectList[key].loop(false).pause();
            }
        }
    },

    /**
     * Resume playing sound effect.
     * @param {String} path The return value of function playEffect.
     * @example
     * //example
     * cc.AudioEngine.getInstance().resumeEffect(path);
     */
    resumeEffect:function (path) {
        var keyname = this._getPathWithoutExt(path);
        if (this._effectList.hasOwnProperty(keyname)) {
            this._effectList[keyname].play();
        }
    },

    /**
     * Resume all playing sound effect
     * @example
     * //example
     * cc.AudioEngine.getInstance().resumeAllEffects();
     */
    resumeAllEffects:function () {
        for (var key in this._effectList) {
            if (this._effectList.hasOwnProperty(key)) {
                this._effectList[key].play();
            }
        }
    },

    /**
     * Stop playing sound effect.
     * @param {String} path The return value of function playEffect.
     * @example
     * //example
     * cc.AudioEngine.getInstance().stopEffect(path);
     */
    stopEffect:function (path) {
        var keyname = this._getPathWithoutExt(path);
        if (this._effectList.hasOwnProperty(keyname)) {
            this._effectList[keyname].loop(false).stop();
        }
    },

    /**
     * Stop all playing sound effects.
     * @example
     * //example
     * cc.AudioEngine.getInstance().stopAllEffects();
     */
    stopAllEffects:function () {
        for (var key in this._effectList) {
            if (this._effectList.hasOwnProperty(key)) {
                this._effectList[key].loop(false).stop();
            }
        }
    }

});

cc.HowlerAudioEngine._instance = null;

/**
 * Get the shared Engine object, it will new one when first time be called.
 * @return {cc.AudioEngine}
 */
cc.HowlerAudioEngine.getInstance = function () {
    if (sys.platform === "browser") {
        if (!this._instance) {
            this._instance = new cc.HowlerAudioEngine();
            this._instance.init();
        }
    }
    return this._instance;
};
