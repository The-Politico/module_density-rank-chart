import * as d3 from 'd3';
import { selection } from 'd3';
import kernel from 'kernel-smooth';
import merge from 'lodash/merge';

selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

selection.prototype.moveToBack = function () {
  return this.each(function () {
    var firstChild = this.parentNode.firstChild;

    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
}; // ... and the important addition. ⬇️⬇️⬇️

/**
 * appendSelect either selects a matching child element of your current
 * selection if one exists or appends that child and selects it. It's useful
 * for writing idempotent chart functions.
 *
 * Use it like this:
 *
 * selection.appendSelect(<element selector>, <class string>)
 *
 * It can be chained like any normal d3 selection:
 *
 * const g = d3.select(myNode).appendSelect('g', 'viz-group');
 * g.appendSelect('rect')
 *   .attr('x', 0); etc.
 *
 * @param  {string} el  String representation of element to be appended/selected.
 * @param  {string} cls Class string (w/out dots) of element to be appended/
 *                      selected. Can pass none or multiple separated by whitespace.
 * @return {object}     d3 selection of child element
 */


selection.prototype.appendSelect = function (el, cls) {
  var selected = cls ? this.select("".concat(el, ".").concat(cls.split(' ').join('.'))) : this.select(el);

  if (selected.size() === 0) {
    return cls ? this.append(el).classed(cls, true) : this.append(el);
  }

  return selected;
};

var defaultData = [{
  "division": "36-15",
  "value": 0.9756512390992161
}, {
  "division": "06-40",
  "value": 0.9529104146257232
}, {
  "division": "06-44",
  "value": 0.9336632880743411
}, {
  "division": "48-29",
  "value": 0.8982488878293525
}, {
  "division": "06-34",
  "value": 0.8954127243248046
}, {
  "division": "36-05",
  "value": 0.8907095431828508
}, {
  "division": "48-09",
  "value": 0.8874812978045163
}, {
  "division": "12-24",
  "value": 0.8757202834545271
}, {
  "division": "06-51",
  "value": 0.8665681323644127
}, {
  "division": "36-13",
  "value": 0.8639039695868974
}, {
  "division": "48-34",
  "value": 0.8588096408151787
}, {
  "division": "48-16",
  "value": 0.8573450379635473
}, {
  "division": "06-35",
  "value": 0.8550749048284173
}, {
  "division": "06-43",
  "value": 0.8535780301029839
}, {
  "division": "48-30",
  "value": 0.8452930070905249
}, {
  "division": "48-33",
  "value": 0.844979846046575
}, {
  "division": "48-15",
  "value": 0.8446792859684624
}, {
  "division": "15-01",
  "value": 0.8378517831596447
}, {
  "division": "06-32",
  "value": 0.837831486142593
}, {
  "division": "48-18",
  "value": 0.8354269363438904
}, {
  "division": "48-28",
  "value": 0.8328973131730665
}, {
  "division": "06-38",
  "value": 0.8304625586284975
}, {
  "division": "06-21",
  "value": 0.8258801569721026
}, {
  "division": "12-26",
  "value": 0.8232933942929214
}, {
  "division": "06-46",
  "value": 0.8180218557717329
}, {
  "division": "06-29",
  "value": 0.8160832584480993
}, {
  "division": "12-25",
  "value": 0.8134346910555886
}, {
  "division": "12-20",
  "value": 0.8111418170222943
}, {
  "division": "34-10",
  "value": 0.8002318184268694
}, {
  "division": "04-07",
  "value": 0.7940129903126405
}, {
  "division": "17-04",
  "value": 0.7873710349383901
}, {
  "division": "48-20",
  "value": 0.7838654866792188
}, {
  "division": "12-27",
  "value": 0.775252939382645
}, {
  "division": "36-14",
  "value": 0.772154299614154
}, {
  "division": "06-16",
  "value": 0.7709999459166368
}, {
  "division": "36-08",
  "value": 0.7706430546223286
}, {
  "division": "06-41",
  "value": 0.7574488978823326
}, {
  "division": "47-09",
  "value": 0.756930869275359
}, {
  "division": "06-17",
  "value": 0.7533974358974359
}, {
  "division": "48-23",
  "value": 0.7519504588838951
}, {
  "division": "06-37",
  "value": 0.7489718031733547
}, {
  "division": "13-04",
  "value": 0.7481576045164344
}, {
  "division": "34-08",
  "value": 0.7469160449173132
}, {
  "division": "48-35",
  "value": 0.7437842469498585
}, {
  "division": "06-19",
  "value": 0.7435062767539795
}, {
  "division": "24-04",
  "value": 0.7340427682789575
}, {
  "division": "06-31",
  "value": 0.7282917632817644
}, {
  "division": "06-27",
  "value": 0.7272982047149239
}, {
  "division": "17-07",
  "value": 0.7257043528843621
}, {
  "division": "04-03",
  "value": 0.724790177267762
}, {
  "division": "13-13",
  "value": 0.7243683332442262
}, {
  "division": "22-02",
  "value": 0.7191922740595806
}, {
  "division": "13-05",
  "value": 0.7166373025392612
}, {
  "division": "15-02",
  "value": 0.7145850707300393
}, {
  "division": "17-02",
  "value": 0.7134670853340036
}, {
  "division": "42-02",
  "value": 0.7099909038333043
}, {
  "division": "36-07",
  "value": 0.7052361772244599
}, {
  "division": "28-02",
  "value": 0.6891800587774457
}, {
  "division": "36-09",
  "value": 0.6884337131854079
}, {
  "division": "26-14",
  "value": 0.6872167786912123
}, {
  "division": "06-39",
  "value": 0.6848657479971834
}, {
  "division": "06-47",
  "value": 0.6833636000993085
}, {
  "division": "01-07",
  "value": 0.6796513780489611
}, {
  "division": "32-01",
  "value": 0.6740019820969068
}, {
  "division": "24-07",
  "value": 0.6667496082043386
}, {
  "division": "26-13",
  "value": 0.6630176231716453
}, {
  "division": "06-15",
  "value": 0.6559268283919254
}, {
  "division": "06-13",
  "value": 0.6555503501497941
}, {
  "division": "06-09",
  "value": 0.652259395825581
}, {
  "division": "06-14",
  "value": 0.6500124100942628
}, {
  "division": "36-06",
  "value": 0.6463203629126091
}, {
  "division": "17-01",
  "value": 0.6447454400018026
}, {
  "division": "45-06",
  "value": 0.6439217708283371
}, {
  "division": "11-98",
  "value": 0.642308375151174
}, {
  "division": "36-16",
  "value": 0.6275326988699044
}, {
  "division": "39-11",
  "value": 0.6247920287567997
}, {
  "division": "06-20",
  "value": 0.6244145162948493
}, {
  "division": "06-06",
  "value": 0.6235087480427531
}, {
  "division": "35-02",
  "value": 0.6227316455841174
}, {
  "division": "35-03",
  "value": 0.6208969900294273
}, {
  "division": "12-10",
  "value": 0.6133541004299944
}, {
  "division": "42-01",
  "value": 0.6059930210814541
}, {
  "division": "34-09",
  "value": 0.6046560821220176
}, {
  "division": "06-22",
  "value": 0.5966402010145392
}, {
  "division": "35-01",
  "value": 0.5958634729501451
}, {
  "division": "48-27",
  "value": 0.594782383769006
}, {
  "division": "13-02",
  "value": 0.5945317146555645
}, {
  "division": "06-53",
  "value": 0.5940780107938127
}, {
  "division": "37-12",
  "value": 0.5932696322921658
}, {
  "division": "12-05",
  "value": 0.5931592495193599
}, {
  "division": "29-01",
  "value": 0.5874690312348871
}, {
  "division": "06-36",
  "value": 0.5854038617256577
}, {
  "division": "25-07",
  "value": 0.584939242157727
}, {
  "division": "48-22",
  "value": 0.5804579421462738
}, {
  "division": "37-01",
  "value": 0.5781000635690394
}, {
  "division": "51-03",
  "value": 0.5762540184653051
}, {
  "division": "06-25",
  "value": 0.5694112254677278
}, {
  "division": "55-04",
  "value": 0.5694063467297481
}, {
  "division": "06-12",
  "value": 0.565351995104932
}, {
  "division": "06-42",
  "value": 0.5621922371184528
}, {
  "division": "12-09",
  "value": 0.5611019902314738
}, {
  "division": "48-07",
  "value": 0.5609105443188578
}, {
  "division": "06-10",
  "value": 0.5605948791668839
}, {
  "division": "06-26",
  "value": 0.5584130183692054
}, {
  "division": "12-23",
  "value": 0.5493018944050349
}, {
  "division": "06-08",
  "value": 0.5356829682420885
}, {
  "division": "13-07",
  "value": 0.5342129004045904
}, {
  "division": "24-05",
  "value": 0.5325051567588361
}, {
  "division": "06-11",
  "value": 0.5308134046357383
}, {
  "division": "32-04",
  "value": 0.5300079516162948
}, {
  "division": "12-14",
  "value": 0.5299792146994511
}, {
  "division": "51-11",
  "value": 0.5294182518574752
}, {
  "division": "53-09",
  "value": 0.5293814548468759
}, {
  "division": "06-23",
  "value": 0.5269310321210876
}, {
  "division": "34-12",
  "value": 0.5204332840965041
}, {
  "division": "34-06",
  "value": 0.5138218274794779
}, {
  "division": "48-02",
  "value": 0.5132812644153845
}, {
  "division": "06-03",
  "value": 0.5129908036564043
}, {
  "division": "51-04",
  "value": 0.5099891389249525
}, {
  "division": "04-01",
  "value": 0.5052263293409512
}, {
  "division": "48-24",
  "value": 0.5030373152107956
}, {
  "division": "48-32",
  "value": 0.49961188912966137
}, {
  "division": "06-30",
  "value": 0.49429216441978113
}, {
  "division": "06-05",
  "value": 0.4941693817365228
}, {
  "division": "48-06",
  "value": 0.4893532223477661
}, {
  "division": "24-02",
  "value": 0.483409321006789
}, {
  "division": "48-14",
  "value": 0.4821596353926641
}, {
  "division": "06-45",
  "value": 0.47755396585508353
}, {
  "division": "51-08",
  "value": 0.4772089581384832
}, {
  "division": "17-11",
  "value": 0.47546105217717355
}, {
  "division": "17-08",
  "value": 0.47424417404500085
}, {
  "division": "48-05",
  "value": 0.4674602382901269
}, {
  "division": "39-03",
  "value": 0.46716595942322714
}, {
  "division": "18-07",
  "value": 0.4581246905485153
}, {
  "division": "06-07",
  "value": 0.4551472534429173
}, {
  "division": "06-28",
  "value": 0.45310813260993876
}, {
  "division": "48-10",
  "value": 0.4509300277029529
}, {
  "division": "48-19",
  "value": 0.45077036276665733
}, {
  "division": "53-04",
  "value": 0.44990825844299037
}, {
  "division": "06-24",
  "value": 0.44726246162088645
}, {
  "division": "06-18",
  "value": 0.4469417692280324
}, {
  "division": "13-12",
  "value": 0.44187377532176436
}, {
  "division": "48-17",
  "value": 0.4411654427938141
}, {
  "division": "06-48",
  "value": 0.4389343396184717
}, {
  "division": "37-04",
  "value": 0.43240327514734567
}, {
  "division": "04-09",
  "value": 0.43159943350057167
}, {
  "division": "48-11",
  "value": 0.4304706470120549
}, {
  "division": "06-50",
  "value": 0.4296053945578878
}, {
  "division": "32-03",
  "value": 0.42515817459555827
}, {
  "division": "08-01",
  "value": 0.4245936104536326
}, {
  "division": "48-31",
  "value": 0.42399530721630513
}, {
  "division": "36-04",
  "value": 0.4227094690422373
}, {
  "division": "12-21",
  "value": 0.4175220402809569
}, {
  "division": "40-05",
  "value": 0.41747265063378075
}, {
  "division": "42-13",
  "value": 0.4156325657494721
}, {
  "division": "17-03",
  "value": 0.41337014799716415
}, {
  "division": "17-10",
  "value": 0.4127821687428981
}, {
  "division": "22-04",
  "value": 0.4127339463547075
}, {
  "division": "06-52",
  "value": 0.41270679670257115
}, {
  "division": "48-03",
  "value": 0.40900419446128966
}, {
  "division": "12-22",
  "value": 0.40736468984321744
}, {
  "division": "12-15",
  "value": 0.4042765253901927
}, {
  "division": "13-01",
  "value": 0.40396142531684764
}, {
  "division": "24-03",
  "value": 0.4023530734662788
}, {
  "division": "28-03",
  "value": 0.4023266963769403
}, {
  "division": "12-07",
  "value": 0.3989395434047351
}, {
  "division": "22-05",
  "value": 0.39865485333223477
}, {
  "division": "13-08",
  "value": 0.3980672784961277
}, {
  "division": "24-06",
  "value": 0.39768497244929174
}, {
  "division": "47-05",
  "value": 0.39725015654519474
}, {
  "division": "36-17",
  "value": 0.39505489073987055
}, {
  "division": "37-09",
  "value": 0.39411695401170327
}, {
  "division": "13-06",
  "value": 0.39011587045043716
}, {
  "division": "24-08",
  "value": 0.38757563105959697
}, {
  "division": "06-49",
  "value": 0.3864515846131921
}, {
  "division": "36-11",
  "value": 0.3841343246123273
}, {
  "division": "37-08",
  "value": 0.3813140873954882
}, {
  "division": "02-00",
  "value": 0.3803733434664893
}, {
  "division": "04-02",
  "value": 0.38029034647902177
}, {
  "division": "08-06",
  "value": 0.37894736842105264
}, {
  "division": "09-04",
  "value": 0.3779413808987753
}, {
  "division": "09-01",
  "value": 0.3762076222304568
}, {
  "division": "01-02",
  "value": 0.3750411778399533
}, {
  "division": "48-21",
  "value": 0.37351778656126483
}, {
  "division": "48-36",
  "value": 0.37293595399346907
}, {
  "division": "48-01",
  "value": 0.3712321820156184
}, {
  "division": "18-01",
  "value": 0.3700466639332145
}, {
  "division": "51-10",
  "value": 0.36792339134888674
}, {
  "division": "36-02",
  "value": 0.3672293501629794
}, {
  "division": "48-12",
  "value": 0.3669988119772733
}, {
  "division": "10-00",
  "value": 0.3649639722048369
}, {
  "division": "36-10",
  "value": 0.3649635535712576
}, {
  "division": "34-01",
  "value": 0.36475774781589354
}, {
  "division": "51-02",
  "value": 0.3638165808984218
}, {
  "division": "27-05",
  "value": 0.36373249392661156
}, {
  "division": "45-07",
  "value": 0.3611346814093443
}, {
  "division": "48-13",
  "value": 0.35643455141984387
}, {
  "division": "29-05",
  "value": 0.35593394857768196
}, {
  "division": "17-09",
  "value": 0.35445709579222107
}, {
  "division": "08-07",
  "value": 0.35433283147437133
}, {
  "division": "40-02",
  "value": 0.3522126540765953
}, {
  "division": "37-13",
  "value": 0.3472886619901892
}, {
  "division": "13-10",
  "value": 0.3466623947094306
}, {
  "division": "01-01",
  "value": 0.3464966259146337
}, {
  "division": "36-12",
  "value": 0.34567761788596607
}, {
  "division": "40-01",
  "value": 0.34504950558401487
}, {
  "division": "45-05",
  "value": 0.3448362636131827
}, {
  "division": "48-26",
  "value": 0.34259883769855776
}, {
  "division": "48-08",
  "value": 0.3425512741031426
}, {
  "division": "06-33",
  "value": 0.34234366789280085
}, {
  "division": "09-03",
  "value": 0.34175397884936637
}, {
  "division": "34-02",
  "value": 0.339544876572982
}, {
  "division": "13-03",
  "value": 0.33512258772666687
}, {
  "division": "37-06",
  "value": 0.33459045015114547
}, {
  "division": "37-02",
  "value": 0.33219247310197747
}, {
  "division": "45-02",
  "value": 0.3289554447902836
}, {
  "division": "13-11",
  "value": 0.32645500559447593
}, {
  "division": "32-02",
  "value": 0.3257237835422835
}, {
  "division": "53-10",
  "value": 0.3255707595492463
}, {
  "division": "28-01",
  "value": 0.32390583971056097
}, {
  "division": "22-06",
  "value": 0.32366883952202274
}, {
  "division": "37-03",
  "value": 0.3225604481278168
}, {
  "division": "51-07",
  "value": 0.32208208801570576
}, {
  "division": "37-07",
  "value": 0.3216386065233489
}, {
  "division": "22-03",
  "value": 0.31869992667402935
}, {
  "division": "51-01",
  "value": 0.31714735677970407
}, {
  "division": "27-04",
  "value": 0.3171320970256786
}, {
  "division": "17-05",
  "value": 0.3169547904130267
}, {
  "division": "01-03",
  "value": 0.31606977935938996
}, {
  "division": "12-18",
  "value": 0.3158936872166582
}, {
  "division": "21-03",
  "value": 0.314380718927723
}, {
  "division": "48-25",
  "value": 0.31371590444874536
}, {
  "division": "44-01",
  "value": 0.3118095252478724
}, {
  "division": "25-03",
  "value": 0.31161102278749336
}, {
  "division": "45-04",
  "value": 0.3111175435479156
}, {
  "division": "05-02",
  "value": 0.31031463088599814
}, {
  "division": "12-03",
  "value": 0.309871137560724
}, {
  "division": "39-09",
  "value": 0.30873384505283247
}, {
  "division": "28-04",
  "value": 0.30781911180694954
}, {
  "division": "36-03",
  "value": 0.30455736768231334
}, {
  "division": "39-01",
  "value": 0.30417888091264206
}, {
  "division": "36-18",
  "value": 0.30370751430980164
}, {
  "division": "36-26",
  "value": 0.30310775722168126
}, {
  "division": "04-08",
  "value": 0.30240272928807527
}, {
  "division": "42-14",
  "value": 0.2979183266932271
}, {
  "division": "34-05",
  "value": 0.2952943078913325
}, {
  "division": "45-01",
  "value": 0.2947675134403086
}, {
  "division": "36-25",
  "value": 0.29453539957796326
}, {
  "division": "12-19",
  "value": 0.2918319276249426
}, {
  "division": "09-05",
  "value": 0.2906467571179669
}, {
  "division": "53-07",
  "value": 0.29055613735929336
}, {
  "division": "08-03",
  "value": 0.28903433883513563
}, {
  "division": "12-16",
  "value": 0.2869953270167854
}, {
  "division": "06-02",
  "value": 0.2842422993975726
}, {
  "division": "40-04",
  "value": 0.28401222807572357
}, {
  "division": "04-05",
  "value": 0.28328997926582467
}, {
  "division": "41-03",
  "value": 0.2809453773483721
}, {
  "division": "05-04",
  "value": 0.28056733032116593
}, {
  "division": "34-07",
  "value": 0.2783274915475046
}, {
  "division": "08-05",
  "value": 0.2778395508231714
}, {
  "division": "12-13",
  "value": 0.2772166121282092
}, {
  "division": "41-01",
  "value": 0.2769366044558931
}, {
  "division": "53-02",
  "value": 0.2754876733501482
}, {
  "division": "20-03",
  "value": 0.27343136440271365
}, {
  "division": "42-16",
  "value": 0.2730693746736528
}, {
  "division": "08-04",
  "value": 0.2728524261502605
}, {
  "division": "04-06",
  "value": 0.27229124776233654
}, {
  "division": "51-05",
  "value": 0.27203421676539513
}, {
  "division": "48-04",
  "value": 0.27200682996870523
}, {
  "division": "53-08",
  "value": 0.2716301902229495
}, {
  "division": "22-01",
  "value": 0.27147521699564686
}, {
  "division": "25-05",
  "value": 0.2680075916438829
}, {
  "division": "01-05",
  "value": 0.26778245052469085
}, {
  "division": "37-05",
  "value": 0.2672065591709311
}, {
  "division": "47-08",
  "value": 0.26684834688408077
}, {
  "division": "31-02",
  "value": 0.26586766642645926
}, {
  "division": "25-01",
  "value": 0.26453154247807953
}, {
  "division": "12-01",
  "value": 0.262372481127409
}, {
  "division": "26-05",
  "value": 0.2591353711790393
}, {
  "division": "45-03",
  "value": 0.25643766932430867
}, {
  "division": "20-04",
  "value": 0.2561066574975529
}, {
  "division": "25-08",
  "value": 0.25452155243600333
}, {
  "division": "34-11",
  "value": 0.25436766852025106
}, {
  "division": "12-06",
  "value": 0.2541168332432054
}, {
  "division": "40-03",
  "value": 0.2531111145635895
}, {
  "division": "12-17",
  "value": 0.25039842003483603
}, {
  "division": "04-04",
  "value": 0.24902930759983105
}, {
  "division": "53-01",
  "value": 0.24742050811175892
}, {
  "division": "26-12",
  "value": 0.24734270092637184
}, {
  "division": "39-10",
  "value": 0.24714382792239312
}, {
  "division": "49-04",
  "value": 0.24465587039190503
}, {
  "division": "12-08",
  "value": 0.2423202603042896
}, {
  "division": "36-01",
  "value": 0.24149836989188936
}, {
  "division": "41-05",
  "value": 0.24077222211751698
}, {
  "division": "34-03",
  "value": 0.23969149828564915
}, {
  "division": "12-04",
  "value": 0.23925945954628444
}, {
  "division": "42-15",
  "value": 0.23917721237461914
}, {
  "division": "17-17",
  "value": 0.23860045792787635
}, {
  "division": "05-03",
  "value": 0.2380868565867194
}, {
  "division": "05-01",
  "value": 0.2365467109891171
}, {
  "division": "17-12",
  "value": 0.2337768324551501
}, {
  "division": "06-04",
  "value": 0.23226969844121112
}, {
  "division": "12-02",
  "value": 0.2317572236402352
}, {
  "division": "01-06",
  "value": 0.22963549692527038
}, {
  "division": "49-02",
  "value": 0.22824584021705366
}, {
  "division": "36-20",
  "value": 0.22760899776103766
}, {
  "division": "17-06",
  "value": 0.22714017783580204
}, {
  "division": "20-01",
  "value": 0.22564637302444784
}, {
  "division": "13-14",
  "value": 0.22469642854592736
}, {
  "division": "06-01",
  "value": 0.2243755193647592
}, {
  "division": "53-06",
  "value": 0.2237209770119131
}, {
  "division": "13-09",
  "value": 0.2203190963957956
}, {
  "division": "34-04",
  "value": 0.21961266714572414
}, {
  "division": "37-10",
  "value": 0.2175345324389119
}, {
  "division": "26-09",
  "value": 0.21647868930309866
}, {
  "division": "25-02",
  "value": 0.21359996759340527
}, {
  "division": "27-03",
  "value": 0.2125217326279187
}, {
  "division": "17-13",
  "value": 0.21033484328657878
}, {
  "division": "44-02",
  "value": 0.20779064870622715
}, {
  "division": "17-14",
  "value": 0.20732813400268513
}, {
  "division": "12-12",
  "value": 0.20542204186830812
}, {
  "division": "26-02",
  "value": 0.20454627069343198
}, {
  "division": "26-03",
  "value": 0.20186168050155667
}, {
  "division": "26-11",
  "value": 0.20154277914947782
}, {
  "division": "12-11",
  "value": 0.19888216115510013
}, {
  "division": "24-01",
  "value": 0.19744808441585185
}, {
  "division": "51-06",
  "value": 0.19652009928757938
}, {
  "division": "18-02",
  "value": 0.19428493016254517
}, {
  "division": "41-02",
  "value": 0.1938991440442546
}, {
  "division": "16-02",
  "value": 0.1903259844641013
}, {
  "division": "47-07",
  "value": 0.1899996095806223
}, {
  "division": "47-04",
  "value": 0.18989426476189455
}, {
  "division": "55-01",
  "value": 0.18892313283155474
}, {
  "division": "26-06",
  "value": 0.18833060935318915
}, {
  "division": "39-13",
  "value": 0.18730054386911182
}, {
  "division": "53-03",
  "value": 0.1858504555935574
}, {
  "division": "42-04",
  "value": 0.18524942382740336
}, {
  "division": "49-01",
  "value": 0.18192634335949748
}, {
  "division": "18-05",
  "value": 0.17940860875182174
}, {
  "division": "09-02",
  "value": 0.17696520377986394
}, {
  "division": "36-24",
  "value": 0.17677265004195167
}, {
  "division": "47-03",
  "value": 0.17521956451070664
}, {
  "division": "42-17",
  "value": 0.1750033270322443
}, {
  "division": "27-02",
  "value": 0.17491524338141426
}, {
  "division": "25-06",
  "value": 0.17477939950068702
}, {
  "division": "21-06",
  "value": 0.17415817844633283
}, {
  "division": "26-08",
  "value": 0.17401154778146855
}, {
  "division": "55-02",
  "value": 0.17164434780732044
}, {
  "division": "46-00",
  "value": 0.17114579734871183
}, {
  "division": "49-03",
  "value": 0.17036469000599017
}, {
  "division": "08-02",
  "value": 0.17010932925723465
}, {
  "division": "31-01",
  "value": 0.1698375575762861
}, {
  "division": "20-02",
  "value": 0.16915142269310976
}, {
  "division": "42-06",
  "value": 0.1623869776065195
}, {
  "division": "01-04",
  "value": 0.16052351716702726
}, {
  "division": "18-03",
  "value": 0.16046202596340592
}, {
  "division": "17-16",
  "value": 0.15810618403444546
}, {
  "division": "19-03",
  "value": 0.15724874302861452
}, {
  "division": "56-00",
  "value": 0.15637301060496134
}, {
  "division": "53-05",
  "value": 0.1546813282210808
}, {
  "division": "41-04",
  "value": 0.1536949846994311
}, {
  "division": "25-04",
  "value": 0.15362438661550892
}, {
  "division": "16-01",
  "value": 0.1523184447666922
}, {
  "division": "42-07",
  "value": 0.15128237639875658
}, {
  "division": "31-03",
  "value": 0.15099079260111492
}, {
  "division": "42-08",
  "value": 0.1490320622754829
}, {
  "division": "36-19",
  "value": 0.14748257909944515
}, {
  "division": "39-02",
  "value": 0.140306270262813
}, {
  "division": "42-11",
  "value": 0.13999530402213334
}, {
  "division": "18-04",
  "value": 0.1394793759419496
}, {
  "division": "39-12",
  "value": 0.13733483552225614
}, {
  "division": "19-02",
  "value": 0.13718594454807856
}, {
  "division": "38-00",
  "value": 0.13628521982933103
}, {
  "division": "47-02",
  "value": 0.13583107879375023
}, {
  "division": "39-08",
  "value": 0.1336007400861593
}, {
  "division": "37-11",
  "value": 0.1333263379650743
}, {
  "division": "27-01",
  "value": 0.13250600600151385
}, {
  "division": "30-00",
  "value": 0.1316759674454827
}, {
  "division": "29-04",
  "value": 0.12959021734560894
}, {
  "division": "25-09",
  "value": 0.12892195231515827
}, {
  "division": "21-01",
  "value": 0.12434301540553726
}, {
  "division": "29-02",
  "value": 0.12419063542512836
}, {
  "division": "55-08",
  "value": 0.12378067243970593
}, {
  "division": "21-02",
  "value": 0.12340994473057332
}, {
  "division": "36-22",
  "value": 0.12032124817536796
}, {
  "division": "55-05",
  "value": 0.11946334288836187
}, {
  "division": "39-04",
  "value": 0.11836859557712251
}, {
  "division": "29-06",
  "value": 0.11783961581474903
}, {
  "division": "26-07",
  "value": 0.11746620086344013
}, {
  "division": "19-04",
  "value": 0.11697913568516388
}, {
  "division": "36-23",
  "value": 0.11239041265691556
}, {
  "division": "29-07",
  "value": 0.11218454877270778
}, {
  "division": "17-18",
  "value": 0.10985716607175879
}, {
  "division": "47-06",
  "value": 0.10925267145054514
}, {
  "division": "19-01",
  "value": 0.1087276723089872
}, {
  "division": "39-14",
  "value": 0.10666247039049043
}, {
  "division": "27-07",
  "value": 0.1060801582300426
}, {
  "division": "39-05",
  "value": 0.10496989094521049
}, {
  "division": "39-15",
  "value": 0.1045698478785402
}, {
  "division": "51-09",
  "value": 0.10347744884874839
}, {
  "division": "18-09",
  "value": 0.10163038621821342
}, {
  "division": "55-06",
  "value": 0.10058792899939789
}, {
  "division": "27-06",
  "value": 0.09765631250718264
}, {
  "division": "21-04",
  "value": 0.09609376155846042
}, {
  "division": "42-10",
  "value": 0.0960916670585402
}, {
  "division": "36-21",
  "value": 0.09587637512405821
}, {
  "division": "42-03",
  "value": 0.09554333635708338
}, {
  "division": "26-10",
  "value": 0.09534720690522316
}, {
  "division": "54-02",
  "value": 0.09404423315022827
}, {
  "division": "18-08",
  "value": 0.09343708922073658
}, {
  "division": "29-08",
  "value": 0.09194606516478675
}, {
  "division": "17-15",
  "value": 0.09160328143044881
}, {
  "division": "39-07",
  "value": 0.08884354887949243
}, {
  "division": "33-02",
  "value": 0.08781031638676529
}, {
  "division": "29-03",
  "value": 0.0877520493964093
}, {
  "division": "26-01",
  "value": 0.08757874301524902
}, {
  "division": "33-01",
  "value": 0.08730613040025174
}, {
  "division": "26-04",
  "value": 0.0822486336773598
}, {
  "division": "18-06",
  "value": 0.08202030934057224
}, {
  "division": "47-01",
  "value": 0.08194932650937825
}, {
  "division": "36-27",
  "value": 0.0808839376466057
}, {
  "division": "39-16",
  "value": 0.07944105805068372
}, {
  "division": "27-08",
  "value": 0.07914939074070722
}, {
  "division": "42-12",
  "value": 0.07891372073288112
}, {
  "division": "55-07",
  "value": 0.07873518232527309
}, {
  "division": "55-03",
  "value": 0.07597665382645677
}, {
  "division": "42-05",
  "value": 0.07558374375509336
}, {
  "division": "42-18",
  "value": 0.07200752672198524
}, {
  "division": "42-09",
  "value": 0.07019258703769164
}, {
  "division": "54-03",
  "value": 0.06931401366176775
}, {
  "division": "23-01",
  "value": 0.06836201248779966
}, {
  "division": "50-00",
  "value": 0.06562086326684753
}, {
  "division": "54-01",
  "value": 0.06366811165579549
}, {
  "division": "23-02",
  "value": 0.05679170993291575
}, {
  "division": "39-06",
  "value": 0.05423511213793064
}, {
  "division": "21-05",
  "value": 0.0411550874331156
}];

var chart = (function () {
  return {
    /**
     * Develop your chart in this render function.
     *
     * For more details about this pattern, see Mike Bostock's proposal for
     * reusable charts: https://bost.ocks.org/mike/chart/
     */
    render: function render() {
      /**
       * Set default chart properties in this object. Users can overwrite them
       * by passing a props object through the module's create or update methods.
       */
      var props = {
        densityFill: '#ddd',
        pointFill: '#333',
        height: 60,
        margin: {
          top: 15,
          right: 10,
          bottom: 0,
          left: 10
        },
        axisLabels: {
          min: 'Least',
          max: 'Most'
        },
        title: 'Density',
        kernel: {
          function: kernel.fun.epanechnikov,
          bandwidth: 0.05
        }
      }; // The point we will highlight

      var point = 0.5;

      function chart(selection$$1) {
        selection$$1.each(function (data, i, elements) {
          /**
           * YOUR D3 CODE HERE 📈 📊 🌐
           */
          var node = elements[i]; // the selected element

          var _node$getBoundingClie = node.getBoundingClientRect(),
              width = _node$getBoundingClie.width;

          var _props = props,
              margin = _props.margin,
              height = _props.height;
          var extent = d3.extent(data);
          var offset = (extent[1] - extent[0]) / 100;
          var x = d3.scaleLinear().domain([extent[0], extent[1]]).range([0, width - margin.right - margin.left]);
          var density = kernel.density(data, props.kernel.function, props.kernel.bandwidth);
          var densityPath = x.ticks(100).map(function (d) {
            var x = d;
            var y = density(x);
            return [x, y];
          }); // Always make density path start and end at the Y baseline

          densityPath.unshift([extent[0], 0]);
          densityPath.push([extent[1], 0]);
          var pointPath = [[point - offset, 0], [point - offset, density(point - offset)], [point + offset, density(point + offset)], [point + offset, 0]];
          var y = d3.scaleLinear().domain([0, d3.max(densityPath, function (d) {
            return d[1];
          })]).range([height - margin.bottom - margin.top, 0]);
          d3.select(node).appendSelect('h5').style('text-align', 'center').text(props.title);
          d3.select(node).appendSelect('svg');
          var legend = d3.select(node).appendSelect('div', 'legend');
          legend.appendSelect('span', 'min').style('float', 'left').text(props.axisLabels.min);
          legend.appendSelect('span', 'max').style('float', 'right').text(props.axisLabels.max);
          var g = d3.select(node).appendSelect('svg') // see docs in ./utils/d3.js
          .attr('width', width).attr('height', height).appendSelect('g').attr('transform', "translate(".concat(margin.left, ", ").concat(margin.top, ")"));
          g.appendSelect('path', 'density').datum(densityPath).attr('fill', props.densityFill).attr('d', d3.line().curve(d3.curveBasis).x(function (d) {
            return x(d[0]);
          }).y(function (d) {
            return y(d[1]);
          }));
          g.appendSelect('path', 'highlight').datum(pointPath).attr('fill', props.pointFill).attr('d', d3.line().curve(d3.curveMonotoneX).x(function (d) {
            return x(d[0]);
          }).y(function (d) {
            return y(d[1]);
          }));
          var triangle = d3.symbol().type(d3.symbolTriangle).size(y(offset));
          g.appendSelect('path', 'pointer').attr('fill', props.pointFill).attr('d', triangle).attr('transform', "\n            rotate(180 ".concat(x(point), " ").concat(y(density(point)), ")\n            translate(").concat(x(point), ", ").concat(y(density(point)) + 10, ")\n            "));
        });
      }
      /**
       * Getter-setters merge any user-provided properties with the defaults.
       */


      chart.props = function (obj) {
        if (!obj) return props;
        props = merge(props, obj);
        return chart;
      };

      chart.point = function (d) {
        if (d === undefined) return point;
        point = d;
        return chart;
      };

      return chart;
    },

    /**
     * Draws the chart by calling the idempotent render function with
     * a selected element.
     */
    draw: function draw() {
      var chart = this.render().point(this._point).props(this._props);
      d3.select(this._selection).datum(this._data).call(chart);
    },

    /**
     * The following methods represent the external API of this chart module.
     *
     * See ../preview/App.jsx for an example of how they are used.
     */

    /**
     * Creates the chart initially.
     */
    create: function create(selection$$1, point, data) {
      var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      this._selection = selection$$1;
      this._point = point || 0;
      this._data = data || defaultData.map(function (d) {
        return d.value;
      });
      this._props = props;
      this.draw();
    },

    /**
     * Updates the chart with new data and/or props.
     */
    update: function update(point, data) {
      var props = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this._point = point;
      this._data = data || this._data;
      this._props = props;
      this.draw();
    },

    /**
     * Resizes the chart.
     */
    resize: function resize() {
      this.draw();
    }
  };
});

export default chart;
