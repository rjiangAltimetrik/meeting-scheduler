import common from '../common.js';

function getJson(state) {
  const json = {
    start: state.selectedSlot.start,
    end: state.selectedSlot.end,
    targets: [{
      name: state.name,
      email: state.email,
    }],
  };
  return json;
}

export default common.createModule({
  namespaced: true,
  initState() {
    return {
      availableSlots: [],
      selectedSlot: null,
      name: '',
      email: '',
    };
  },
  mutations: {
    selectTimeSlot(state, payload) {
      state.selectedSlot = payload.selected ? payload.slot : null;
    },
    update: common.mutations.update,
    setTimeSlots(state, payload) {
      state.meetingWindowProps = Object.assign({}, payload.meetingWindow);
      state.availableSlots = payload.availableSlots || [];
      state.selectedSlot = null;
    },
  },
  actions: {
    getTimeSlots({ dispatch, commit }) {
      const getMeetingWindowPromise = dispatch({
        type: 'api/request',
        options: {
          method: 'get',
          tokenType: 'event',
          uri: 'windows/public',
          onSuccess: (responseData) => {
            commit({
              type: 'meetingWindow/setMeetingWindow',
              meetingWindow: responseData,
            }, { root: true });
            return responseData.id;
          },
        },
      }, { root: true });

      return getMeetingWindowPromise.then(meetingWindowId => (
        dispatch({
          type: 'api/request',
          options: {
            method: 'get',
            tokenType: 'event',
            uri: `windows/${meetingWindowId}/time-slots`,
            loading: 'timeSlots/timeSlots',
            onSuccess: (responseData) => {
              commit({
                type: 'setTimeSlots',
                availableSlots: responseData.time_slots,
              });
            },
          },
        }, { root: true })
      ));
    },
    submit({ dispatch, state, rootState }) {
      const json = getJson(state);
      const meetingWindowId = rootState.meetingWindow.id;

      // simulating service request for now
      return dispatch({
        type: 'api/request',
        options: {
          method: 'post',
          tokenType: 'event',
          data: json,
          uri: `windows/${meetingWindowId}/schedule`,
          loading: 'timeSlots/submit',
        },
      }, { root: true });
    },
  },
});
