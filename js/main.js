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

        setTimeout(function() {
            $btn.removeClass('is-open');
            $list.removeClass('is-open');
            $body.removeClass('noscroll');
        }, 100); 
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

    // 3. GSAPプラグインの登録
    gsap.registerPlugin(ScrollTrigger);

    // 4. チャートアニメーション
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

// 7. Works詳細モーダル（修正版）
    $('.ww_card').on('click', function() {
        const targetId = $(this).data('modal');
        if (targetId) {
            $('#' + targetId).fadeIn(300);
            $('body').addClass('is-modal-open'); // クラスを追加
        }
    });

    $('.ww_modal_overlay').on('click', function(e) {
        if($(e.target).hasClass('ww_modal_close_btn') || !$(e.target).closest('.ww_modal_content').length) {
            $(this).fadeOut(300);
            $('body').removeClass('is-modal-open'); // クラスを削除
        }
    });
});