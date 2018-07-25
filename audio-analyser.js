var AudioAnalyser = function (src) {
    var self = this;
    //AudioContext = w.AudioContext || w.webkitAudioContext;
    
    this.audio = new Audio(src);    
    this.audio.controls = true;
    
    this.context = new AudioContext();
    this.node = this.context.createScriptProcessor(2048, 1, 1);
    
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 512;
    this.bands = new Uint8Array(this.analyser.frequencyBinCount);


    this.connect = function () {

        self.source = self.context.createMediaElementSource(self.audio);

        self.source.connect(self.analyser);
        self.analyser.connect(self.node);
        self.node.connect(self.context.destination);
        self.source.connect(self.context.destination);
    }

    this.audio.addEventListener('canplay', function () {

        self.connect();

        self.node.onaudioprocess = function () {
            self.analyser.getByteFrequencyData(self.bands);
            if (!self.audio.paused) {
                if (typeof self.update === "function") {
                    return self.update(self.bands);
                } else {
                    return 0;
                }
            }
        };
    });

    return this;
};