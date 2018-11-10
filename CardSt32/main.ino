// Includes.
#include <HTS221Sensor.h>  // Capteur Humidité et Température
#include <WiFiST.h>        // WiFi de la carte IOT Node
#include <PubSubClient.h>  //cette librairie permet d’envoyer et de recevoir des messages MQTT et de gérer le QoS
#include <SPI.h>           // cette librairie vous permet de communiquer avec des périphériques SPI
#include <LPS22HBSensor.h> // Capteur Barométrique
#include <LIS3MDLSensor.h> // Magnétomètre ( boussolle digitale )
#include <LSM6DSLSensor.h> // 3D Gyroscope et Accelerométre)

#define I2C2_SCL PB10 // Port IC2 SCL utilisé sur la carte IOT Node
#define I2C2_SDA PB11 // Port IC2 SDA utilisé sur la carte IOT Node
#define SerialPort Serial
#define INT1 PD11
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

void INT1Event();
void setup()
{

    // Led.
    pinMode(LED_BUILTIN, OUTPUT);

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
        while (true)
            ;
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
        Serial.print("Connecting to ThingsBoard node ...");
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

    if (millis() - lastSend > 1000)
    { // Update and send only after x seconds
        getAndSendData();
        lastSend = millis();
    }
    delay(5000); // delais entre chaque boucle ( ici 55 sec)
}

// Génération et envoi des données

void getAndSendData()
{

    Serial.println("Collecting datas...");
    Serial.println("");

    HumTemp->GetHumidity(&humidity); // récupération des données
    HumTemp->GetTemperature(&temperature);

    Serial.println(" ");
    Serial.print("==> Sent Payload Listing  -> ");
    Serial.println(" ");
    Serial.println(" ");

    // Prepare a JSON payload string
    String payload = "{";
    payload += "\"Temperature\":";
    payload += temperature;
    payload += ",";
    payload += "\"Humidite\":";
    payload += humidity;
    payload += ",";
    payload += "\"Bruit\":";
    payload += noise;
    payload += ",";
    payload += "\"acceleration\":";
    payload += acceleration;
    payload += "}";

    // Send payload
    char attributes[100];
    payload.toCharArray(attributes, 100);
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