
class Poll
{
    /**
     * @param {JQuery} $context
     */
    constructor($context)
    {
        this.$context = $context;

        this.poll_options = PollOption.create(this.$context);

        this.poll_options.forEach((/** PollOption */ poll_option) =>
        {
            poll_option.$context.on(PollOption.EVENT_SELECT, (e, index) =>
            {
                this.select(index);
            });

            poll_option.$context.on(PollOption.EVENT_CHANGE_COUNTER, () =>

            {
                this.poll_options.forEach((/** PollOption */ poll_option) =>
                {
                    poll_option.updateCounterPct(this.getSumCounters());
                });

                this.updateCounterAll();

                this.updateLeader();
            });
        });
    }

    select(index_poll_option)
    {
        this.show_results();

        this.poll_options.forEach((/** PollOption */ poll_option) =>
        {
            poll_option.makeDisabled();
        });

        /**
         * @type {PollOption}
         */
        let poll_option = this.poll_options[index_poll_option];

        poll_option.makeYourVoice();

        poll_option.incrementCounter(this.getSumCounters());
    }

    getSumCounters()
    {
        let  sum_counters = 0;

        this.poll_options.forEach((/** PollOption */ poll_option) =>
        {
            sum_counters = sum_counters + poll_option.getCounter();
        });

        return sum_counters;
    }

    show_results()
    {
        this.$context.addClass('show_results');
    }

    updateCounterAll()
    {
        let counters = [];

        this.poll_options.forEach((/** PollOption */ poll_option) =>
        {
           let counter = poll_option.getCounter();

           counters.push(counter);
        });

        function array_sum(array) {
            /** @link https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers **/
            return array.reduce((a, b) => a + b, 0);
        }

        let counter_all = array_sum(counters);

        function declOfNum(number, titles) {
            /** @link https://realadmin.ru/coding/sklonenie-na-javascript.html **/

            number = Math.abs(number) % 100;

            let number1 = number % 10;

            if (number > 10 && number < 20) { return titles[2]; }

            if (number1 > 1 && number1 < 5) { return titles[1]; }

            if (number1 === 1) { return titles[0]; }

            return titles[2];
        }

        let word_person = declOfNum(counter_all, ['человек', 'человека', 'человек']);

        this.$context.find('.counter_all').html(`<b>${counter_all}</b> ${word_person}`);
    }

    updateLeader()
    {
        let counters = [];

        this.poll_options.forEach((/** PollOption */ poll_option) =>
        {
            let counter = poll_option.getCounter();

            counters.push(counter);
        });

        /** @link https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript */
        Array.prototype.max = function() {
            return Math.max.apply(null, this);
        };

        let max_counter = counters.max();

        let index_for_max_counter = null;

        counters.forEach(function (counter, index)
        {
            if (counter === max_counter)
            {
                index_for_max_counter = index;
            }
        });

        let poll_option_with_max_counter = this.poll_options[index_for_max_counter];

        this.poll_options.forEach((/** PollOption */ poll_option) =>
        {
           poll_option.removeLeader();
        });

        poll_option_with_max_counter.makeLeader();
    }

    static create()
    {
        let $polls = $('.poll');

        let polls = [];
        $polls.each((index, element) =>
        {
            let $poll = $(element);

            polls.push(new Poll($poll));
        });

        return polls;
    }
}