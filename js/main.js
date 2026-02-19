'use strict';

$(function() {
    // 1. ハンバーガーメニュー
    $('.spNav_btn').on('click', function() {
        $(this).toggleClass('is-open');
        $('.nav_list').toggleClass('is-open');
        $('body').toggleClass('noscroll');
    });
    
    // リンククリック時に閉じる
    $('.nav_item a').on('click', function() {
        $('.spNav_btn').removeClass('is-open');
        $('.nav_list').removeClass('is-open');
        $('body').removeClass('noscroll');
    });

    // 2. スライダー設定
    const setupSlider = (container) => {
        const slides = container.querySelectorAll('.al_slide');
        const dotsContainer = container.nextElementSibling;
        if (!dotsContainer || !dotsContainer.classList.contains('slider_dots')) return;
        const dots = dotsContainer.querySelectorAll('span');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(slides).indexOf(entry.target);
                    dots.forEach(dot => dot.classList.remove('is-active'));
                    if (dots[index]) dots[index].classList.add('is-active');
                }
            });
        }, { root: container, threshold: 0.6 });
        slides.forEach(slide => observer.observe(slide));
    };
    document.querySelectorAll('.al_list').forEach(setupSlider);

    // 3. GSAP登録
    gsap.registerPlugin(ScrollTrigger);

    // 4. チャート（Top用・ガード付）
    if (document.querySelector(".td_pink-mask")) {
        gsap.to(".td_pink-mask", {
          scrollTrigger: {
            trigger: ".td_chart-container",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          scale: 1,
          duration: 2.0,
          ease: "back.out(1.7)",
        });
    }

    // 5. チェックマーク（Top用・ガード付）
    const items = document.querySelectorAll('.td_item');
    const check = document.querySelector('.td_check-mark');
    if(items.length >= 3 && check && document.querySelector(".td_list_wrapper")) {
        const getPos = (el) => {
            return {
                x: el.offsetLeft + el.offsetWidth + 10,
                y: el.offsetTop + (el.offsetHeight / 2) - 10
            };
        };
        const pos1 = getPos(items[0]);
        const pos2 = getPos(items[1]);
        const pos3 = getPos(items[2]);
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".td_list_wrapper",
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
            delay: 2
        });
        tl.set(check, { x: pos1.x, y: pos1.y, opacity: 0, scale: 1 })
          .to(check, { opacity: 1, duration: 0.1 })
          .to({}, { duration: 0.6 })
          .to(check, { opacity: 0, duration: 0.1 })
          .set(check, { x: pos2.x, y: pos2.y })
          .to(check, { opacity: 1, duration: 0.1 })
          .to({}, { duration: 0.6 })
          .to(check, { opacity: 0, duration: 0.1 })
          .set(check, { x: pos3.x, y: pos3.y })
          .to(check, { opacity: 1, duration: 0.1 })
          .to({}, { duration: 1.0 })
          .to(check, { opacity: 0, duration: 0.1 })
          .set(check, { x: pos2.x, y: pos2.y })
          .to(check, { opacity: 1, duration: 0.1 })
          .to(check, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" });
    }

    // 6. Worksカテゴリー切り替え（安全版）
    const categoryTabs = $('.ww_category_tab');
    if (categoryTabs.length > 0) {
        categoryTabs.on('click', function() {
            const category = $(this).attr('data-category');
            $('.ww_category_tab').removeClass('active');
            $(this).addClass('active');

            const allCards = $('.ww_card');
            gsap.to(allCards, {
                opacity: 0,
                scale: 0.9,
                duration: 0.2,
                onComplete: () => {
                    allCards.hide(); 
                    if (category === 'all') {
                        allCards.show();
                    } else {
                        $(`.ww_card[data-category="${category}"]`).show();
                    }
                    
                    // ここをGSAPが理解しやすい形に修正
                    const visibleCards = $('.ww_card:visible').toArray();
                    gsap.to(visibleCards, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        stagger: 0.08,
                        ease: "power2.out"
                    });
                }
            });
        });
    }
    // 7. Works詳細モーダル（他ページでのエラー防止ガード付）
    const modal = $('#works_modal');
    if (modal.length > 0) {
        const closeBtn = $('.ww_modal_close_btn');

        // カードをクリックした時に開く
        $('.ww_card').on('click', function () {
            modal.fadeIn(300);
            $('body').addClass('noscroll'); // CSS側で .noscroll { overflow: hidden; } を作っている前提
        });

        // 閉じるボタンで閉じる
        closeBtn.on('click', function () {
            modal.fadeOut(300);
            $('body').removeClass('noscroll');
        });

        // 外側をクリックしたら閉じる
        modal.on('click', function (e) {
            if (!$(e.target).closest('.ww_modal_content').length) {
                modal.fadeOut(300);
                $('body').removeClass('noscroll');
            }
        });
    }
});