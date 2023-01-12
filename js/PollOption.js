
class PollOption
{
    static EVENT_SELECT = 'PollOption.EVENT_SELECT';
    static EVENT_CHANGE_COUNTER = 'PollOption.EVENT_CHANGE_COUNTER';

    /**
     * @param {JQuery} $context
     */
    constructor($context)
    {
        this.$context = $context;

        this.$context.find('button').on('click', ()=>
        {
            this.$context.trigger(PollOption.EVENT_SELECT, [this.$context.index()]);
        });
    }

    isDisabled()
    {
        let disabled = this.$context.find('button').attr('disabled');

        return (disabled);
    }

    makeDisabled()
    {
        this.$context.find('button').attr('disabled', true);
    }

    makeYourVoice()
    {
        this.$context.addClass('your_voice');
    }

    setCounter(counter, sum_counters)
    {
        this.$context.find('.counter').text(counter);

        this.updateCounterPct(sum_counters);

        this.$context.trigger(PollOption.EVENT_CHANGE_COUNTER);
    }

    getCounter()
    {
        return parseInt(this.$context.find('.counter').text());
    }

    incrementCounter(sum_counters)
    {
        let diff = 1;
         this.setCounter( this.getCounter() + diff, sum_counters + diff);
    }

    updateCounterPct(sum_counters)
    {
        let counter_pct = ((this.getCounter() / sum_counters) * 100 ).toFixed(2);

        this.$context.find('.counter_pct').text(`${counter_pct}%`);

        this.$context.find('.counter_meter').css('width', `${counter_pct}%`);
    }

    removeLeader()
    {
        this.$context.removeClass('leader');
    }

    makeLeader()
    {
        this.$context.addClass('leader');
    }

    /**
     * @param {JQuery} $parent_context
     * @return {PollOption[]}
     */
    static create($parent_context)
    {
        let $options = $parent_context.find('.option');

        let poll_options = [];
        $options.each((index, element) =>
        {
            let $option = $(element);

            poll_options.push(new PollOption($option));
        });

        return poll_options;
    }
}