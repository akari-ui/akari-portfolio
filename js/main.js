'use strict';

$(function() {
    // 1. ハンバーガーメニュー
    $('.spNav_btn').on('click', function() {
        $(this).toggleClass('is-open');
        $('.nav_list').toggleClass('is-open');
        $('body').toggleClass('noscroll');
    });

    $('.nav_item a').on('click', function() {
        const $btn = $('.spNav_btn');
        const $list = $('.nav_list');
        const $body = $('body');

        // 0.1秒（100ms）だけ処理を遅らせる
        // これだけで、遷移の瞬間のアイコン消失が目立たなくなります
        setTimeout(function() {
            $btn.removeClass('is-open');
            $list.removeClass('is-open');
            $body.removeClass('noscroll');
        }, 100); 
    });

    // 2. スライダー設定（IntersectionObserverによるドットの連動）
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

    // 3. GSAPプラグインの登録
    gsap.registerPlugin(ScrollTrigger);

    // 4. チャートアニメーション（Topページ用）
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

    // 5. チェックマークの動き（Topページ用）
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

    // 6. Worksカテゴリー切り替え
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

    // 7. Works詳細モーダル（複数モーダル対応版）
    // カードをクリックして対応するIDのモーダルを開く
    $('.ww_card').on('click', function() {
        const targetId = $(this).data('modal');
        if (targetId) {
            $('#' + targetId).fadeIn(300);
            $('body').css('overflow', 'hidden'); // 背景スクロール禁止
        }
    });

    // モーダルを閉じる処理（オーバーレイ、または閉じるボタンをクリック）
    $('.ww_modal_overlay').on('click', function(e) {
        // ボタンをクリック、または「背景（contentの外側）」をクリックした時に閉じる
        if($(e.target).hasClass('ww_modal_close_btn') || !$(e.target).closest('.ww_modal_content').length) {
            $(this).fadeOut(300);
            $('body').css('overflow', ''); // スクロール再開
        }
    });
});