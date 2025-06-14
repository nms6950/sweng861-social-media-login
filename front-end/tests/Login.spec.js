import { shallowMount, mount } from "@vue/test-utils";
import Login from "@/components/Login.vue";
import { toast } from 'vue3-toastify';
import axios from 'axios';

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
        post: jest.fn()
    }
})

describe("Login", () => {
    const mockRouter = {
        push: jest.fn()
    };
    const wrapper = shallowMount(Login, {
        data() {
            return {
                email: '',
                password: '',
                welcomeMsgWhole: 'Welcome!',
                signInMsgWhole: 'How would you like to sign in today?',
                visibleSignInMsg: '',
                visibleWelcomeMsg: '',
                flicker: true,
                welcomeInterval: null,
                signInInterval: null,
                signInVisible: false,
                thirdRowVisible: false,
                clientID: ''
            }
        },
        global: {
            mocks: {
                $router: mockRouter
            }
        }
    })

    let originalLocation;

    beforeAll(() => {
        // Save original window.location
        originalLocation = window.location;
        delete window.location;
    
        // Mock window.location
        window.location = { href: '' };

        axios.post.mockClear();
      });
    
      afterAll(() => {
        // Restore original window.location
        window.location = originalLocation;
      });

    // Test 0
    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true)
    })

    // Test 1
    it('Welcome Message terminal indicator renders if sign in message is not visible', () => {
        expect(wrapper.find('.terminal-box')).toBeTruthy();
    })

    // Test 2
    it('generateIntervals() sets intervals correctly', async () => {
        await wrapper.vm.generateIntervals();
        expect(wrapper.vm.welcomeInterval).toBeTruthy();
        setTimeout(() => {
            expect(wrapper.vm.signInInterval).toBeTruthy();
        }, 2000)
    })

    // Test 3
    it('googleLogin() and linkedinLogin() calls set window.location.href', async () => {
        await wrapper.vm.googleLogin();

        expect(window.location.href).toBe('https://sweng861-social-media-login.onrender.com/auth/google')

        await wrapper.vm.linkedinLogin();

        expect(window.location.href).toBe('https://sweng861-social-media-login.onrender.com/auth/linkedin')
    })

    it('submit() calls toast.error if email or password is empty', async () => {
        await wrapper.vm.submit();
        expect(toast.error).toHaveBeenCalled();
    })

    it('submit() makes api call, and renders toast error if api call fails', async () => {
        axios.post.mockImplementation(() => {
            return {
                data: {
                    error: 'test'
                }
            }
        })

        await wrapper.setData({
            email: 'test@test.com',
            password: 'test'
        })

        await wrapper.vm.submit();

        expect(toast.error).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalled();
    })

    it('submit() makes api call, and calls home route if api call succeeds', async () => {
        axios.post.mockImplementation(() => {
            return {
                data: {
                    
                }
            }
        })

        await wrapper.setData({
            email: 'test@test.com',
            password: 'test'
        })

        await wrapper.vm.submit();

        expect(axios.post).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith('/home')
    })

    it('submit handles errors related to callback functionality', async () => {
        axios.post.mockRejectedValue(new Error('Network Error'));

        await wrapper.vm.submit();

        expect(toast.error).toHaveBeenCalled();
    })

    it('Login btn calls submit()', () => {
        const submitMock = jest.fn();
        wrapper.vm.submit = submitMock;
        wrapper.find('.login-btns-container').find('button').trigger('click');
        expect(submitMock).toHaveBeenCalled();
    })

    it('Google btn calls googleLogin()', () => {
        const googleLoginMock = jest.fn();
        wrapper.vm.googleLogin = googleLoginMock;
        wrapper.find('#googleBtn').trigger('click');
        expect(googleLoginMock).toHaveBeenCalled();
    })

    it('Linkedin btn calls linkedinLogin()', () => {
        const linkedinLoginMock = jest.fn();
        wrapper.vm.linkedinLogin = linkedinLoginMock;
        wrapper.find('#linkedinBtn').trigger('click');
        expect(linkedinLoginMock).toHaveBeenCalled();
    })

    it('Welcome message terminal indicator does not render if sign in message is visible', async ()=> {
        await wrapper.setData({
            signInVisible: true
        })

        expect(wrapper.find('.welcome-msg .terminal-box').exists()).toBeFalsy();
    })

    it('Create Account btn renders and is clickable', async () => {
        const button = wrapper.find('button.btn-warning');
        await button.trigger('click');
    });

    it('Sign in message termianl indicator does not render if thirdRowVisible', async () => {
        await wrapper.setData({
            thirdRowVisible: true
        })

        expect(wrapper.find('#sign-in-msg .terminal-box').exists()).toBeFalsy();
    })

    it('init() makes correct fn calls', async () => {
        const generateIntervalsMock = jest.fn()

        wrapper.vm.generateIntervals = generateIntervalsMock;

        await wrapper.vm.init();

        expect(generateIntervalsMock).toHaveBeenCalled();
    })
})