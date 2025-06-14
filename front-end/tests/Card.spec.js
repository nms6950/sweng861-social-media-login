import { shallowMount, mount } from "@vue/test-utils";
import Card from "@/components/Card.vue";

describe("Card", () => {
    const wrapper = shallowMount(Card, {
        props: {
            show: null
        },
        global: {
            stubs: {
                fa: true
            }
        }
    })

    it('show card does not render if show is falsy', () => {
        expect(wrapper.find('.card').exists()).toBeFalsy()
    })

    it('show card renders if show is truthy', async () => {
        await wrapper.setProps({ show: {}})

        expect(wrapper.find('.card').exists()).toBeTruthy()
    })

    it('Update icon emits updateShow event on click', async () => {
        await wrapper.find('.btn.btn-info').trigger('click')

        expect(wrapper.emitted('updateShow')).toBeTruthy()
    })

    it('Delete icon emits deleteShow event on click', async () => {
        await wrapper.find('.btn.btn-danger').trigger('click')

        expect(wrapper.emitted('deleteShow')).toBeTruthy()
    })

    it('show data renders if values are truthy', async () => {
        await wrapper.setProps({ show: {
            title: 'Show Title',
            critics_score: 11,
            audience_score: 10,
            release_date: 'test',
            image_url: 'test'
        }})

        expect(wrapper.find('img').exists()).toBeTruthy()
        expect(wrapper.find('.card-title').text()).toBe('Show Title')
        expect(wrapper.find('.card-row').text()).toContain('10/100')
        expect(wrapper.find('.card-row').text()).toContain('11/100')
        expect(wrapper.find('.card-row').text()).toContain('test')
    })
})