let $polls = $('.poll');

function array_sum(array) {
    /** @link https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers **/
    return array.reduce((a, b) => a + b, 0);
}

/** @link https://gist.github.com/realmyst/1262561 */
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

/** @link https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript */
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

$polls.each(function (index, element)
{
    let $poll = $(element);

    let $buttons = $poll.find('button');

    $buttons.on('click', function (event)
    {
        let $button = $(event.currentTarget);

        $poll.addClass('show_results');

        $buttons.attr('disabled', true);

        let $option = $button.parents('.option');

        $option.addClass('your_voice');

        let $options = $poll.find('.option');

        let  counter = parseInt($option.find('.counter').text()) + 1;

        $option.find('.counter').text(counter);

        let  counters = [];

        $options.each(function (index, element)
        {
            let $option = $(element);

            let counter_string = $option.find('.counter').text();

            let counter = parseInt(counter_string);

            counters.push(counter);
        });

        let sum_counters = array_sum(counters);

        let word_person = declOfNum(sum_counters, ['человек', 'человека', 'человек']);

        $poll.find('.counter_all').html(`<b>${sum_counters}</b> ${word_person}`);

        $options.each(function (index, element)
        {
            let $option = $(element);

            let  counter = counters[index];

            let counter_pct = ((counter / sum_counters) * 100).toFixed(2);

            $option.find('.counter_pct').text(`${counter_pct}%`);

            $option.find('.counter_meter').css('width', `${counter_pct}%`);
        });

        let max_counter = counters.max();

        let index_for_max_counter = null;

        counters.forEach(function (counter, index)
        {
            if (counter === max_counter){

                index_for_max_counter = index;
            }
        });

        let $option_with_max_counter = $($options.get(index_for_max_counter));

        $options.removeClass('leader');

        $option_with_max_counter.addClass('leader');
    });
});