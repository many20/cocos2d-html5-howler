#cocos2d-html5-howler


##Description

Extension of SimpleAudioEngine.js to use howler.js as Audio Engine.

[Howler.js](http://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library) 

[howler on github](https://github.com/goldfire/howler.js)


Howler uses the Web Audio API and the HTML5 Audio API as fallback.
Why ist the Web Audio API better as the Audio API?

Web Audio is much more flexible and on the iPhone/iPad the Audio API is really bad.

---

TODO: make it compatible with cocos2d 3.x 

##Use

add the 'howler.js' and 'HowlerAudioEngine.js' to your loader config

---

change in SimpleAudioEngine.js:

    cc.AudioEngine.getInstance = function () {
    if (!this._instance) {
        this._instance = new cc.AudioEngine();
        this._instance.init();
    }
    return this._instance;
    };

to:

    cc.AudioEngine.getInstance = function () {
    if (sys.platform === "browser") {
        if (!this._instance) {
            this._instance = new cc.HowlerAudioEngine();
            this._instance.init();
        }
    } else {
        if (!this._instance) {
            this._instance = new cc.AudioEngine();
            this._instance.init();
        }
    }
    return this._instance;
    };

so the preloader can use howler


##License

Released under the MIT License.
