var Analyse = function (src) {
    var an = this;
        //AudioContext = w.AudioContext || w.webkitAudioContext;

    //�������� ���������
    this.audio = new Audio(src);
    //this.audio.src = src;
    this.audio.controls = true;
    //������� �����-��������
    this.context = new AudioContext();
    this.node = this.context.createScriptProcessor(2048, 1, 1);
    //������� ����������
    this.analyser = this.context.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 512;
    this.bands = new Uint8Array(this.analyser.frequencyBinCount);
    //������������� �� �������
    this.audio.addEventListener('canplay', function () {
        //���������� �� ��������� �  AudioContext 
        an.source = an.context.createMediaElementSource(an.audio);
        //��������� �������� � ������������
        an.source.connect(an.analyser);
        //��������� ���������� � �����������, �� �������� �� ����� �������� ������
        an.analyser.connect(an.node);
        //��������� ��� � �������
        an.node.connect(an.context.destination);
        an.source.connect(an.context.destination);
        //������������� �� ������� ��������� ������� ������
        an.node.onaudioprocess = function () {
            an.analyser.getByteFrequencyData(an.bands);
            if (!an.audio.paused) {
                if (typeof an.update === "function") {
                    return an.update(an.bands);
                } else {
                    return 0;
                }
            }
        };
    });

    return this;
};