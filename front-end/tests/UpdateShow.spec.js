import { shallowMount, mount } from "@vue/test-utils";
import UpdateShow from "@/components/UpdateShow.vue";
import axios from 'axios';
import { toast } from 'vue3-toastify'
import * as bootstrap from 'bootstrap'
import { Modal } from 'bootstrap';

// Mock toast from vue3-toastify
jest.mock('vue3-toastify', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn()
    }
}));

jest.mock('axios', () => {
    return {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn()
    }
})

jest.mock('bootstrap', () => {
    const mockHide = jest.fn();
    const mockInstance = { hide: mockHide };
  
    const Modal = jest.fn(() => mockInstance);
    Modal.getInstance = jest.fn(() => null); // or return mockInstance
  
    return { Modal };
});

describe("UpdateShow", () => {
    const wrapper = shallowMount(UpdateShow, {
        props: {
            show: {
                id: 40,
                title: '',
                critics_score: 10,
                audience_score: 11,
                release_date: '',
                image_url: ''
            }
        },
        data() {
            return {
                title: '',
                critics_score: null,
                audience_score: null,
                release_date: '',
                image_url: ''
            }
        },
        global: {
            stubs: {
                fa: true
            }
        }
    })
    
    it('submit() makes error toast if api call fails', async () => {
        axios.put.mockImplementation(() => {
            return {
                data: {
                    error: 'test'
                }
            }
        })

        await wrapper.setData({
            title: 'Test Title'
        })

        await wrapper.vm.submit();

        expect(axios.put).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
        expect(toast.success).not.toHaveBeenCalled();
    })

    it('submit() makes success toast and closes modal if api call succeeds', async () => {
        axios.put.mockImplementation(() => {
            return {
                data: {
                    
                }
            }
        })

        const fakeEl = await document.createElement('div');
        fakeEl.id = 'updateShowModal';
        await jest.spyOn(document, 'getElementById').mockReturnValue(fakeEl);

        await wrapper.setData({
            title: 'Test Title'
        })

        await wrapper.vm.submit();

        expect(axios.put).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalled();
        expect(wrapper.emitted('refresh')).toBeTruthy();
        expect(Modal().hide).toHaveBeenCalled();
        expect(wrapper.vm.title).toBe('')
        expect(wrapper.vm.critics_score).toBe(null)
        expect(wrapper.vm.audience_score).toBe(null)
        expect(wrapper.vm.release_date).toBe('')
        expect(wrapper.vm.image_url).toBe('')
        expect(document.getElementById).toHaveBeenCalled();
    })

    it('submit() generates toast msg if axios call encounters error', async () => {
        axios.put.mockRejectedValue(new Error('Network Error'));

        await wrapper.vm.submit();

        expect(toast.error).toHaveBeenCalled();
    })

    it('Submit Btn calls submit() on click', async () => {
        const submitMock = jest.fn()
        wrapper.vm.submit = submitMock;

        await wrapper.find('.btn.btn-primary').trigger('click')

        expect(submitMock).toHaveBeenCalled();
    })
})