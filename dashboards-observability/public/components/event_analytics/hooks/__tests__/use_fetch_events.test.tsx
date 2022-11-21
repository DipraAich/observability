import { waitFor } from '@testing-library/dom';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DSLService from 'public/services/requests/dsl';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { HttpResponse, IToasts, NotificationsStart } from '../../../../../../../src/core/public';
import { QueryManager } from '../../../../../common/query_manager/ppl_query_manager';
import { IVisualizationContainerProps } from '../../../../../common/types/explorer';
import PPLService from '../../../../../public/services/requests/ppl';
import SavedObjects from '../../../../../public/services/saved_objects/event_analytics/saved_objects';
import TimestampUtils from '../../../../../public/services/timestamp/timestamp';
import { TEST_CONFIG_AVAILABILITY, TEST_DATA } from '../../../../../test/event_analytics_constants';
import { samplePPLResponse } from '../../../../../test/panels_constants';
import { coreStartMock } from '../../../../../test/__mocks__/coreMocks';
import httpClientMock from '../../../../../test/__mocks__/httpClientMock';
import { Explorer } from '../../explorer/explorer';
import { DataConfigPanelItem } from '../../explorer/visualizations/config_panel/config_panes/config_controls/data_configurations_panel';
import { TabContext } from '../use_tab_context';

describe('Explorer component', () => {
  configure({ adapter: new Adapter() });
  const middlewares: any[] = [];
  const mockStore = configureStore(middlewares);
  const initialState = {
    queries: {
      pomjQYQBg4Jf5lv0c5Ke: {
        rawQuery: '',
        finalQuery:
          "source=opensearch_dashboards_sample_data_logs | where timestamp >= '2022-11-08 09:03:50' and timestamp <= '2022-11-09 09:03:50' ",
        index: '',
        selectedTimestamp: 'timestamp',
        0: 'now-24h',
        1: 'now',
        tabCreatedType: 'newTab',
        isLoaded: true,
      },
    },
    queryResults: {
      pomjQYQBg4Jf5lv0c5Ke: {
        schema: [
          { name: 'name1', type: 'string' },
          { name: 'name2', type: 'string' },
        ],
        dataRows: [
          ['data11', 'data12'],
          ['data21', 'data22'],
        ],
        total: 200,
        size: 200,
        jsonData: [
          {
            name1: 'data11',
            name2: 'data12',
          },
          {
            name1: 'data21',
            name2: 'data22',
          },
        ],
      },
    },
    fields: {
      pomjQYQBg4Jf5lv0c5Ke: {
        selectedFields: [],
        unselectedFields: [
          { name: 'name1', type: 'string' },
          { name: 'name2', type: 'string' },
        ],
        availableFields: [
          { name: 'name1', type: 'string' },
          { name: 'name2', type: 'string' },
        ],
        queriedFields: [],
      },
    },
    countDistribution: {
      pomjQYQBg4Jf5lv0c5Ke: {
        data: { name1: ['data11', 'data21'], name2: ['data12', 'data22'] },
        metaData: {
          fields: [
            { name: 'name1', type: 'string' },
            { name: 'name2', type: 'string' },
          ],
          size: 2,
          status: 200,
        },
        jsonData: [
          {
            name1: 'data11',
            name2: 'data12',
          },
          { name1: 'data21', name2: 'data22' },
        ],
      },
    },
    explorerVisualization: {},
    explorerVisualizationConfig: {},
  };
  const store = mockStore(initialState);

  const tabId = 'pomjQYQBg4Jf5lv0c5Ke';
  const pplService = ({
    http: jest.fn(),
    fetch: jest.fn(),
  } as unknown) as PPLService;

  const dslService = ({
    http: jest.fn(),
    fetch: jest.fn(),
    fetchIndices: jest.fn(),
    fetchFields: jest.fn(),
  } as unknown) as DSLService;

  const core = coreStartMock;
  const history = jest.fn() as any;
  history.replace = jest.fn();
  const setToast = jest.fn();
  const curSelectedTabId = { current: undefined };
  const notificationObj1: NotificationsStart = {
    toasts: ({ addError: jest.fn() } as unknown) as IToasts,
  };

  it('Renders Explorer component', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Explorer
          pplService={pplService}
          dslService={dslService}
          history={history}
          savedObjectId={tabId}
          setToast={setToast}
          tabId={tabId}
          http={core.http}
          savedObjects={new SavedObjects(core.http)}
          timestampUtils={new TimestampUtils(dslService)}
          notifications={notificationObj1}
          curSelectedTabId={curSelectedTabId}
          queryManager={new QueryManager()}
        />
      </Provider>
    );
    wrapper.update();

    await waitFor(() => {
      expect(wrapper).toMatchSnapshot();
    });
  });
  it('use_fetch_visualization functions called', async () => {
    const localState = {
      ...initialState,
      query: {
        pomjQYQBg4Jf5lv0c5Ke: {
          rawQuery: '',
          finalQuery: '',
          index: '',
          selectedTimestamp: 'timestamp',
          0: 'now-24h',
          1: 'now',
          tabCreatedType: 'newTab',
          isLoaded: true,
        },
      },
    };
    const localPPLService = new PPLService(core.http);
    httpClientMock.post = jest.fn(() =>
      Promise.resolve((samplePPLResponse as unknown) as HttpResponse)
    );
    const localStore = mockStore(localState);
    const wrapper = mount(
      <Provider store={localStore}>
        <Explorer
          pplService={localPPLService}
          dslService={dslService}
          history={history}
          savedObjectId={tabId}
          setToast={setToast}
          tabId={tabId}
          http={core.http}
          savedObjects={new SavedObjects(core.http)}
          timestampUtils={new TimestampUtils(dslService)}
          notifications={notificationObj1}
          curSelectedTabId={curSelectedTabId}
          queryManager={new QueryManager()}
        />
      </Provider>
    );
    wrapper.update();
    await waitFor(() => {
      expect(wrapper).toMatchSnapshot();
    });
    wrapper
      .find('textarea[data-test-subj="searchAutocompleteTextArea"]')
      .simulate('keypress', { key: 'Enter' });
    wrapper
      .find('select[data-test-subj="eventAnalytics__EventIntervalSelect"]')
      .simulate('change', { value: 'm' });
  });
});

describe('DataConfigPanelItem component', () => {
  configure({ adapter: new Adapter() });
  const middlewares: any[] = [];
  const mockStore = configureStore(middlewares);
  const initialState = {};
  const store = mockStore(initialState);

  it('Renders DataConfigPanelItem component', async () => {
    const viz = {
      ...TEST_CONFIG_AVAILABILITY,
      data: {
        ...TEST_CONFIG_AVAILABILITY.data,
        query: {
          rawQuery:
            "source = opensearch_dashboards_sample_data_logs | where match(request,'filebeat')",
          finalQuery:
            "source=opensearch_dashboards_sample_data_logs | where timestamp >= '2021-12-31 18:30:00' and timestamp <= '2022-11-17 06:37:08' | where match(request,'filebeat')",
          index: '',
          selectedTimestamp: 'timestamp',
          selectedDateRange: ['now/y', 'now'],
          tabCreatedType: 'redirect_tab',
          savedObjectId: 'MM0qHYMBVusSGvW09eu2',
          objectType: 'savedQuery',
          isLoaded: true,
        },
        userConfigs: {
          dataConfig: {
            ...TEST_DATA,
          },
        },
      },
    };
    const core = coreStartMock;
    const pplService = new PPLService(core.http);

    httpClientMock.post = jest.fn(() =>
      Promise.resolve((samplePPLResponse as unknown) as HttpResponse)
    );
    const wrapper = mount(
      <Provider store={store}>
        <TabContext.Provider
          value={{
            handleQueryChange: jest.fn(),
            pplService,
          }}
        >
          <DataConfigPanelItem
            fieldOptionList={[
              { label: 'agent', name: 'agent', type: 'string' },
              { label: 'bytes', name: 'bytes', type: 'long' },
            ]}
            visualizations={(viz as unknown) as IVisualizationContainerProps}
            queryManager={new QueryManager()}
          />
        </TabContext.Provider>
      </Provider>
    );
    wrapper.update();
    await waitFor(() => {
      expect(wrapper).toMatchSnapshot();
    });
    wrapper.find('button[data-test-subj="visualizeEditorRenderButton"]').simulate('click');
  });
});
