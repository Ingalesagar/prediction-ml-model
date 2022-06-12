import * as React from 'react'
import {
  Row,
  Col,
  Slider,
  InputNumber,
  Typography,
  Card,
  Statistic,
  Select,
  Switch,
  Button,
  Spin,
} from 'antd'
import { useQuery } from 'react-query'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import MainContainer from './MainContainer'
import QRCode from 'react-qr-code'
const { Title, Text } = Typography
const COLORS = [
  '#293462',
  '#7858A6',
  '#EC9B3B',
  '#14C38E',
  '#EC994B',
  '#F32424',
  '#417D7A',
  '#E4AEC5',
]

function SingleSlider({ min, max, step, value, onChange, text, addonAfter }) {
  return (
    <>
      <Title
        style={{
          marginBottom: '3px',
        }}
        level={5}
      >
        {text}
      </Title>
      <Row align="middle" gutter={8}>
        <Col span={addonAfter ? 14 : 18}>
          <Slider
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            value={value}
          />
        </Col>
        <Col span={addonAfter ? 10 : 6}>
          <InputNumber
            min={1}
            style={{ width: '100%' }}
            size="large"
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            addonAfter={addonAfter}
          />
        </Col>
      </Row>
    </>
  )
}
function RainBow({ items, colors }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '150px',
        alignItems: 'end',
        marginBottom: '2rem',
        zIndex: 1,
        width: '100%',
        inset: 0,
      }}
    >
      {items.map((el, i) => {
        const calculated = Math.round((el[0] / el[1]) * 100)
        return (
          <div
            key={'' + i + el[0] + el[1]}
            style={{
              flex: '100%',
              backgroundColor: colors[i],
              height: calculated + '%',
            }}
          ></div>
        )
      })}
    </div>
  )
}

// change me
const URL = 'https://prediction-ml-model.herokuapp.com/predict'
async function predict(
  locality,
  bhk,
  balcony,
  bathroom,
  parking,
  age,
  sqft,
  dist,
) {
  const rawResponse = await fetch(URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locality,
      bhk,
      balcony,
      bathroom,
      parking,
      property_age: age,
      sqft,
      railway_distance: dist,
    }),
  })
  const content = await rawResponse.json()
  if (!rawResponse.ok) {
    // create error object and reject if not a 2xx response code
    let err = new Error('HTTP status code: ' + rawResponse.status)
    err.rawResponse = rawResponse
    err.status = rawResponse.status
    err.data = content
    throw err
  }
  return content
}

function MainApp({}) {
  const [locality, setlocality] = React.useState(0)

  const [bhk, setBHK] = React.useState(1)
  const [balcony, setbalcony] = React.useState(1)
  const [bathroom, setbathroom] = React.useState(1)
  const [parking, setparking] = React.useState(0)

  const [age, setage] = React.useState(1)
  const [sqft, setsqft] = React.useState(1)
  const [dist, setdist] = React.useState(1)
  const [br, setbr] = React.useState(false)

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: [locality, bhk, balcony, bathroom, parking, age, sqft, dist],
    queryFn: () =>
      predict(locality, bhk, balcony, bathroom, parking, age, sqft, dist),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  })
  // console.log(data, isLoading, isError, isSuccess) : YD
  return (
    <MainContainer>
      <Row
        gutter={40}
        align="end"
        style={{
          padding: '2rem 0',
        }}
      >
        <Col span={24}>
          {isError ? (
            <Text
              type="danger"
              style={{
                marginTop: '-.5rem',
                display: 'block',
                textAlign: 'center',
              }}
            >
              Error when fetching prediction from server
            </Text>
          ) : null}
        </Col>
        <Col span={6} style={{ alignSelf: 'end', marginBottom: '-2rem' }}>
          <RainBow
            colors={COLORS}
            items={[
              [bhk, 6],
              [balcony, 6],
              [bathroom, 6],
              [parking, 6],
              [age, 100],
              [sqft, 5000],
              [dist, 100],
            ]}
          />
          <div>
            <Title
              level={5}
              style={{
                marginBottom: '3px',
              }}
            >
              Select Locality
            </Title>
            <Select
              value={locality}
              onChange={setlocality}
              size="large"
              style={{ width: '100%' }}
            >
              <Select.Option value={0}>Adharwadi</Select.Option>
              <Select.Option value={1}>Khadakpada</Select.Option>
              <Select.Option value={2}>Shree Complex</Select.Option>
            </Select>
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={10} style={{ display: 'flex', justifyContent: 'center' }}>
          <Spin spinning={isLoading} style={{ width: '100%' }}>
            <Card style={{ width: '100%', position: 'relative' }}>
              <Statistic
                title="Predicted Price for Selected Variables"
                value={
                  isSuccess
                    ? Math.round(data.prediction * 100000).toLocaleString(
                        'en-in',
                      )
                    : '00,00,000'
                }
                precision={2}
                style={{
                  fontSize: '4rem',
                  textAlign: 'center',
                  zIndex: 5,
                  position: 'relative',
                }}
                valueStyle={{ color: !isError ? '#3f8600' : 'red' }}
              />
            </Card>
          </Spin>
        </Col>
        <Col
          span={4}
          style={{
            alignSelf: 'end',
            display: 'flex',
            justifyContent: 'end',
            padding: '0px',
            marginBottom: '-10px',
          }}
        >
          <div
            style={{
              width: 'fit-content',
            }}
          >
            {br ? (
              <QRCode
                size="175"
                value={[
                  locality,
                  bhk,
                  balcony,
                  bathroom,
                  parking,
                  age,
                  sqft,
                  dist,
                ].join('||')}
              />
            ) : null}
          </div>
        </Col>
        <Col
          span={3}
          style={{ alignSelf: 'end', display: 'flex', justifyContent: 'end' }}
        >
          <div>
            <Row gutter={5} align="middle">
              <Col>
                <Text>QRCode</Text>
              </Col>
              <Col>
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  checked={br}
                  onChange={setbr}
                />
              </Col>
            </Row>
            <Button
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setBHK(0)
                setbalcony(0)
                setbathroom(0)
                setparking(0)
                setage(0)
                setsqft(0)
                setdist(0)
              }}
              type="danger"
              size="middle"
            >
              Reset Variables
            </Button>
          </div>
        </Col>
      </Row>
      <Row justify="center" gutter={[40, 40]} style={{ marginTop: '2rem' }}>
        <Col span={6}>
          <SingleSlider
            text="Select BHK"
            value={bhk}
            onChange={setBHK}
            min={1}
            max={6}
            step={1}
          />
        </Col>

        <Col span={6}>
          <SingleSlider
            text="Select No. of Balcony"
            value={balcony}
            onChange={setbalcony}
            min={1}
            max={6}
            step={1}
          />
        </Col>
        <Col span={6}>
          <SingleSlider
            text="Select No. of Bathroom"
            value={bathroom}
            onChange={setbathroom}
            min={1}
            max={6}
            step={1}
          />
        </Col>
        <Col span={6}>
          <SingleSlider
            text="Select No. of Parking"
            value={parking}
            onChange={setparking}
            min={0}
            max={6}
            step={1}
          />
        </Col>
        <Col span={7}>
          <SingleSlider
            text="Select Age of Property"
            value={age}
            onChange={setage}
            min={1}
            addonAfter="Years"
          />
        </Col>
        <Col span={7}>
          <SingleSlider
            text="Enter Property Square Foot"
            value={sqft}
            onChange={setsqft}
            addonAfter="Sqft"
            min={1}
            max={5000}
          />
        </Col>
        <Col span={7}>
          <SingleSlider
            text="Distance from Railway Station"
            value={dist}
            addonAfter="KM"
            onChange={setdist}
            min={1}
            max={100}
          />
        </Col>
      </Row>
    </MainContainer>
  )
}

export default MainApp
