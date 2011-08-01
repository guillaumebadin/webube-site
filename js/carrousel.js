/**
 * Created by JetBrains PhpStorm.
 * User: guillaumebadin
 * Date: 27/07/11
 * Time: 15:51
 * WebUbe Property
 */


function Carousel(el, ui, pages, opts)
{
    var C1 = "current-card";
    var C2 = "new-card";
    var W = 908;
    var actualWidth = 909;
    var self = this;
    var len = pages.length;
    var sid = null
    var animating = false;
    var currentIndex = 0;
    var template = '<img src="IMG_URL" alt=""/></a><div class="left-div">BODY_COPY<a class="cta green" href="LINK">BT_LABEL</a></div>'

    function createDot(i)
    {
        var d = document.createElement('div');
        d.id = 'dot' + i;
        d.className = 'cr-dot' + (i != 0 ? '' : ' selected');
        d.onclick = function()
        {
            callByIndex(i);
        };

        return d;
    }

    if (el != null)
    {
        this.container = el;
        this.pages = pages;
        this.index = 0;
        this.timer = 5000;
        this.transitionDuration = 1;
        for (var i = 0; i < len; i++)
        {
            var d = createDot(i);
            var item = pages[i];
            d.style.left = Math.round(actualWidth / len * i) + 'px';
            d.style.width = Math.round(actualWidth / len) - 1 + 'px';
            if (i == len - 1) d.className = d.className + ' last';
            d.innerHTML = '<img src="URL"/>'.replace('URL', item.thumb) + '<span>' + item.title + '</span>';

            ui.appendChild(d);
        }

        if (opts)
        {
            if (opts.timePerSlide) this.timer = opts.timePerSlide * 1000;
            if (opts.transitionDuration) this.transitionDuration = opts.transitionDuration;
        }

        function callNext()
        {
            self.index++;
            if (self.index > len - 1)
                self.index = 0;

            callByIndex(self.index, true);
        }

        function callBefore()
        {
            self.index--;
            if (self.index < 0)
                self.index = len - 1;

            self.reverse = true;
            callByIndex(self.index, true);
        }

        function callByIndex(index, force)
        {
            if (animating || index == self.index && !force) return;
            if (currentIndex > index) self.reverse = true;
            self.index = index;
            var first = document.getElementById(C1);
            var second = document.createElement('div');
            second.id = C2;
            second.className = 'card';
            second.style.left = (self.reverse ? -W : W) + 'px';

            el.appendChild(second);
            var item = pages[index];
            var btLabel = item.btLabel ? item.btLabel : 'Learn More';
            var html = template.replace('IMG_URL', item.img).replace('LINK', item.link).replace('BODY_COPY', item.body).replace('BT_LABEL', btLabel);
            second.innerHTML = html;

            animate();

            if (sid)
                clearTimeout(sid);

            sid = setTimeout(callNext, self.timer);

            for (var i = 0; i < len; i++)
            {
                var d = document.getElementById('dot' + i);
                d.className = 'cr-dot' + (i == index ? ' selected' : '');
                if (i == len - 1) d.className = d.className + ' last';
            }
            currentIndex = index;
        }

        function onAnimateEnd()
        {
            var first = document.getElementById(C1);
            var second = document.getElementById(C2);
            first.parentNode.removeChild(first);
            second.id = C1;
            second.style.left = 0 + 'px';
            animating = false;
            self.reverse = false;
        }

        function animate()
        {
            animating = true;
            var first = document.getElementById(C1);
            var second = document.getElementById(C2);
            var opts = {complete:onAnimateEnd};
            if (self.reverse)
            {
                $(first).animate({left:W}, opts);
                $(second).animate({left:0});
            }
            else
            {
                $(first).animate({left:-W}, opts);
                $(second).animate({left:0});
            }
        }

        sid = setTimeout(callNext, self.timer);
    }

    this.next = function()
    {
        callNext();
    };

    this.prev = function()
    {
        callBefore();
    };

    this.precache = function(slides)
    {
        var i, m1, m2;
        var imgs = [];
        for (var i = 0; i < slides.length; i++)
        {
            imgs.push(slides[i].img);
        }

        var len = imgs.length;
        var iIndex = 0;
        var temp = document.createElement('img');
        temp.style.display = 'none';

        function nextImage()
        {
            iIndex++;
            loadImage();
        }

        function loadImage()
        {
            if (iIndex >= len)
            {
                temp = null;
                return;
            }
            var src = imgs[iIndex];
            temp.src = src;
        }

        temp.onload = nextImage;
        loadImage();
    };

    self.precache(pages);
}
;