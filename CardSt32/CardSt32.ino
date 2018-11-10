// Includes.
#include <WiFiST.h>        // WiFi de la carte IOT Node
#include <PubSubClient.h>  //cette librairie permet d’envoyer et de recevoir des messages MQTT et de gérer le QoS
#include <SPI.h>           // cette librairie vous permet de communiquer avec des périphériques SPI
#include <HTS221Sensor.h>  // Capteur Humidité et Température
#include <LSM6DSLSensor.h> // 3D Gyroscope et Accelerométre)

#define I2C2_SCL PB10 // Port IC2 SCL utilisé sur la carte IOT Node
#define I2C2_SDA PB11 // Port IC2 SDA utilisé sur la carte IOT Node
#define SerialPort Serial
#define INT1 PD11
#define MG_PIN  A2     //define which analog input channel you are going to use
#define BOOL_PIN A2
#define DC_GAIN 3.5   //define the DC gain of amplifier
#define READ_SAMPLE_INTERVAL 50    //define how many samples you are going to take in normal operation
#define READ_SAMPLE_TIMES 8.5     //define the time interval(in milisecond) between each samples in 
#define ZERO_POINT_VOLTAGE 0.226 //define the output of the sensor in volts when the concentration of CO2 is 400PPM
#define REACTION_VOLTGAE 0.030 //define the voltage drop of the sensor when move the sensor from air into 1000ppm CO2
#define SonPIN A5
#define SEUIL_SON 80
#define UID "005A694ed"
#define TOKEN "i3RSj7HqWBY8O5LAiNL4" // Clé / Token généré dans le Device de Thingsboard

// Update these with values suitable for your network.
char ssid[] = "hackaton";             // SSID  du reaseau Wifi sur lequel se connectera la carte
const char *password = "JsUgBcM666!"; // Mot de passe du SSID
//const
const int threshold_acc = 300;
const int sndIntensity = A0;
const int threshold_piezzo = 100;

// WiFi module setup
SPIClass SPI_3(PC12, PC11, PC10);
WiFiClass WiFi(&SPI_3, PE0, PE1, PE8, PB13);
float CO2Curve[3]  =  {2.602,ZERO_POINT_VOLTAGE,(REACTION_VOLTGAE/(2.602-3))};   
WiFiClient STClient;

int status = WL_IDLE_STATUS; // the Wifi  status
unsigned long lastSend;

PubSubClient client(STClient); // Declaration du Cleint PubSub
long lastMsg = 0;              // Format de variable
char msg[8];                   // Format de variable

char thingsboardServer[] = "172.18.0.130"; // adresse du site serveur thingsboard

// Variables des differents capteurs

HTS221Sensor *HumTemp;
LSM6DSLSensor *AccGyr;
TwoWire *dev_i2c;
//Data
float acceleration; //en mg
float humidity;     //en %
float temperature;  //en °C
bool noise;         //True si bruit
int loudness = 0;
int tauxCo2 = 0;

void INT1Event();
void setup()
{
    pinMode(BOOL_PIN, INPUT); //set pin to input
    pinMode(SonPIN, INPUT);
    digitalWrite(BOOL_PIN, HIGH); //turn on pullup resistors
    // Initialize serial for output.
    Serial.begin(115200); // démarage de la connection serie à la vitesse de 115200 bauds

    setup_wifi(); // Initialisation du module WiFi

    client.setServer(thingsboardServer, 1883); // port utilisé pour transférer les dats sur le serveur Thingsboard
    lastSend = 0;

    // Initialisation du Bus I2C
    dev_i2c = new TwoWire(I2C2_SDA, I2C2_SCL);
    dev_i2c->begin();

    //Interrupts.
    attachInterrupt(INT1, INT1Event, RISING);

    // Initialisation des capteurs
    HumTemp = new HTS221Sensor(dev_i2c);
    HumTemp->Enable();

    AccGyr = new LSM6DSLSensor(dev_i2c, LSM6DSL_ACC_GYRO_I2C_ADDRESS_LOW);
    AccGyr->Enable_X();
    //Threshold pour l'accelerometre
    AccGyr->Set_Wake_Up_Threshold(threshold_acc);
    //Enable Wake Up Detection.
    AccGyr->Enable_Wake_Up_Detection(LSM6DSL_INT1_PIN);
}

void setup_wifi()
{
    delay(100);

    // Initialize the WiFi module:
    if (WiFi.status() == WL_NO_SHIELD)
    {
        Serial.println("WiFi module not detected");
        // don't continue:
        while (true);
    }

    // Attempt to connect to Wifi network:
    Serial.print("Attempting to connect to WIFI network: ");
    Serial.print(ssid);
    Serial.println(". . .");
    while (status != WL_CONNECTED)
    {
        Serial.print(status);
        // Connect to network:
        status = WiFi.begin(ssid, password);
        // Wait 10 seconds for connection:
        delay(10000);
    }
    Serial.println();
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.println("");
}

void reconnect()
{
    // Loop until we're reconnected
    while (!client.connected())
    {
        Serial.print("Connecting to Server ...");
        // Attempt to connect (clientId, username, password)
        if (client.connect("STMicro Discovery IOT Node", NULL, NULL))
        {
            Serial.println("[DONE]");
            Serial.println("");
        }
        else
        {
            Serial.print("[FAILED] [ rc = ");
            Serial.print(client.state());
            Serial.println(" : retrying in 5 seconds]");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}

void loop()
{

    // Clignotement de la Led à chaque boucle ( emission des datas vers le serveur)
    digitalWrite(LED_BUILTIN, HIGH);
    delay(250);
    digitalWrite(LED_BUILTIN, LOW);
    delay(250);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(250);
    digitalWrite(LED_BUILTIN, LOW);
    delay(250);

    if (!client.connected())
    {
        reconnect();
    }
    client.loop();

    //bloque 4500ms
    noise = getNoise();
    //bloque500ms
    float volts = MGRead(BOOL_PIN);
    tauxCo2 = MGGetPercentage(volts, CO2Curve);
    if (millis() - lastSend > 1000)
    { // Update and send only after x seconds
        getAndSendData();
        lastSend = millis();
    }
}

// Génération et envoi des données

void getAndSendData()
{
    Serial.println("Collecting datas...");
    Serial.println("");

    HumTemp->GetHumidity(&humidity); // récupération des données
    HumTemp->GetTemperature(&temperature);
    AccGyr->Disable_X();

    Serial.println(" ");
    Serial.print("==> Sent Payload Listing  -> ");
    Serial.println(" ");
    Serial.println(" ");

    // Prepare a JSON payload string
    String payload = "{";
    payload += "\"uid\":\"";
    payload += UID;
    payload += "\",";
    payload += "\"temperature\":";
    payload += temperature;
    payload += ",";
    payload += "\"humidity\":";
    payload += humidity;
    payload += ",";
    payload += "\"noise\":";
    payload += noise;
    payload += ",";
    payload += "\"acceleration\":";
    payload += acceleration;
    payload += ",\"tauxCo2\":";
    payload += tauxCo2;
    payload += "}";

    // Send payload
    char attributes[128];
    payload.toCharArray(attributes, 128);
    client.publish("v1/devices/me/telemetry", attributes);
    Serial.print("Payload ");
    Serial.println(attributes);
    Serial.println("");

    noise = false;
    acceleration = 0;
    loudness = 0;
    AccGyr->Enable_X();
}

void INT1Event()
{
    int accOld = acceleration;
    int32_t accelerometer[3];
    //get data
    AccGyr->Get_X_Axes(accelerometer);
    acceleration = sqrt(accelerometer[0] * accelerometer[0] + accelerometer[1] * accelerometer[1] + accelerometer[2] * accelerometer[2]);
    acceleration = (acceleration > accOld ? acceleration : accOld);
}

float MGRead(int mg_pin)
{
    int i;
    float v=0;

    for (i=0;i<50;i++) {
        v += analogRead(mg_pin);
        delay(10);
    }
    v = (v/50) *5/1024;
    return v;  
}

int MGGetPercentage(float volts, float *pcurve)
{
   if ((volts/DC_GAIN )>=ZERO_POINT_VOLTAGE) {
      return -1;
   } else { 
      return pow(10, ((volts/DC_GAIN)-pcurve[1])/pcurve[2]+pcurve[0]);
   }
}

bool getNoise(){
  int sound_overflow= 0;
  for(int i=0;i<450;i++){
    if(analogRead(SonPIN) < SEUIL_SON) ++sound_overflow;
    delay(10);
  }
  return sound_overflow > 120;
}
