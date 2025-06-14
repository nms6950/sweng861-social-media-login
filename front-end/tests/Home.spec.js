import { shallowMount, mount } from "@vue/test-utils";
import Home from "@/components/Home.vue";
import { toast } from 'vue3-toastify';
import axios from 'axios';
import { Modal } from 'bootstrap'


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
        get: jest.fn().mockImplementation(() => {
            return {
                data: []
            }
        }),
        post: jest.fn()
    }
})

// Put these outside your test block to access them
const mockShow = jest.fn();

jest.mock('bootstrap', () => {
  return {
    Modal: jest.fn().mockImplementation(() => ({
      show: mockShow
    }))
  };
});

  

describe("Home", () => {
    const mockRouter = {
        push: jest.fn()
    };
    const wrapper = shallowMount(Home, {
        data() {
            return {
                shows: [],
                title_input: '',
                updatedShow: {},
                deletedShow: {}
            }
        },
        stubs: {
            fa: true
        },
        global: {
            mocks: {
                $router: mockRouter
            },
            stubs: {
                fa: true, // Stub the Font Awesome icon
                Card: true, // Also stub other components if used
                NavBar: true,
                UpdateShow: true,
                DeleteShow: true,
                NewShow: true,
            }
        }
    })

    beforeAll(() => {
        axios.post.mockClear();
    });

    it('initNewShowModal() makes correct fn calls', async () => {
        await wrapper.vm.initNewShowModal();

        expect(mockShow).toHaveBeenCalled();
    })
    
    it('Add Show btn calls initNewShowModal()', async () => {
        let initNewShowModalMock = jest.fn();

        wrapper.vm.initNewShowModal = initNewShowModalMock;


        await wrapper.find('.btn.btn-primary').trigger('click');

        expect(initNewShowModalMock).toHaveBeenCalled();
    })

    it('initUpdateModal() makes correct fn calls', async () => {
        await wrapper.vm.initUpdateModal('mock');

        expect(mockShow).toHaveBeenCalled();
        expect(wrapper.vm.updatedShow).toEqual('mock');
    })

    it('initDeleteModal() makes correct fn calls', async () => {
        await wrapper.vm.initDeleteModal('mock');

        expect(mockShow).toHaveBeenCalled();
        expect(wrapper.vm.deletedShow).toEqual('mock');
    })

    it('getAllShows() makes correct fn calls', async () => {
        axios.get.mockImplementation(() => {
            return {
                data: [{
                    title: 'test'
                }]
            }
        })

        await wrapper.vm.getAllShows();

        expect(wrapper.vm.shows.length).toBe(1)
        expect(axios.get).toHaveBeenCalled();
    })

    it('Card calls initUpdateModal on updateShow event', async () => {
        const initUpdateModalMock = jest.fn();
        wrapper.vm.initUpdateModal = initUpdateModalMock;


        // Find the stubbed Card component properly
        const cardStub = wrapper.findComponent({ name: 'Card' });

        // Emit the event from it
        cardStub.vm.$emit('updateShow');

        expect(initUpdateModalMock).toHaveBeenCalled();
    })

    it('Card calls initDeleteModal on deleteShow event', async () => {
        const initDeleteModalMock = jest.fn();
        wrapper.vm.initDeleteModal = initDeleteModalMock;


        // Find the stubbed Card component properly
        const cardStub = wrapper.findComponent({ name: 'Card' });

        // Emit the event from it
        cardStub.vm.$emit('deleteShow');

        expect(initDeleteModalMock).toHaveBeenCalled();
    })

    it('UpdateShow calls getAllShows on refresh event', async () => {
        const getAllShowsMock = jest.fn();
        wrapper.vm.getAllShows = getAllShowsMock;


        // Find the stubbed Card component properly
        const cardStub = wrapper.findComponent({ name: 'UpdateShow' });

        // Emit the event from it
        cardStub.vm.$emit('refresh');

        expect(getAllShowsMock).toHaveBeenCalled();
    })

    it('DeleteShow calls getAllShows on refresh event', async () => {
        const getAllShowsMock = jest.fn();
        wrapper.vm.getAllShows = getAllShowsMock;


        // Find the stubbed Card component properly
        const cardStub = wrapper.findComponent({ name: 'DeleteShow' });

        // Emit the event from it
        cardStub.vm.$emit('refresh');

        expect(getAllShowsMock).toHaveBeenCalled();
    })

    it('NewShow calls getAllShows on refresh event', async () => {
        const getAllShowsMock = jest.fn();
        wrapper.vm.getAllShows = getAllShowsMock;


        // Find the stubbed Card component properly
        const cardStub = wrapper.findComponent({ name: 'NewShow' });

        // Emit the event from it
        cardStub.vm.$emit('refresh');

        expect(getAllShowsMock).toHaveBeenCalled();
    })
})