import { shallowMount, mount } from "@vue/test-utils";
import DeleteShow from "@/components/DeleteShow.vue";
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
        put: jest.fn(),
        delete: jest.fn()
    }
})

jest.mock('bootstrap', () => {
    const mockHide = jest.fn();
    const mockInstance = { hide: mockHide };
  
    const Modal = jest.fn(() => mockInstance);
    Modal.getInstance = jest.fn(() => null); // or return mockInstance
  
    return { Modal };
});

describe("DeleteShow", () => {
    const wrapper = shallowMount(DeleteShow, {
        props: {
            show: null
        },
        data() {
            return {

            }
        },
        global: {
            stubs: {
                fa: true
            }
        }
    })

    it('Delete msg renders if show is truthy', async () => {
        expect(wrapper.find('.modal-body').exists()).toBeFalsy();

        await wrapper.setProps({
            show: {
                id: 40,
                title: '',
                critics_score: 10,
                audience_score: 11,
                release_date: '',
                image_url: ''
            }
        })

        expect(wrapper.find('.modal-body').exists()).toBeTruthy();
    })
    
    it('submit() makes error toast if api call fails', async () => {
        axios.delete.mockImplementation(() => {
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

        expect(axios.delete).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalled();
        expect(toast.success).not.toHaveBeenCalled();
    })

    it('submit() makes success toast and closes modal if api call succeeds', async () => {
        axios.delete.mockImplementation(() => {
            return {
                data: {
                    
                }
            }
        })

        const fakeEl = document.createElement('div');
        fakeEl.id = 'deleteConfirmationModal';
        jest.spyOn(document, 'getElementById').mockReturnValue(fakeEl);

        await wrapper.setData({
            title: 'Test Title'
        })

        await wrapper.vm.submit();

        expect(axios.delete).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalled();
        expect(wrapper.emitted('refresh')).toBeTruthy();
        expect(Modal().hide).toHaveBeenCalled();
        expect(document.getElementById).toHaveBeenCalled();
    })

    it('submit() generates toast msg if axios call encounters error', async () => {
        axios.delete.mockRejectedValue(new Error('Network Error'));

        await wrapper.vm.submit();

        expect(toast.error).toHaveBeenCalled();
    })

    it('Submit Btn calls submit() on click', async () => {
        const submitMock = jest.fn()
        wrapper.vm.submit = submitMock;

        await wrapper.find('.btn.btn-danger').trigger('click')

        expect(submitMock).toHaveBeenCalled();
    })
})