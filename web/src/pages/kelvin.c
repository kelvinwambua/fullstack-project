#include <stdio.h>
int main() {
    float celsiu, kelvin;
    printf("Enter temperature in Celsius: ");
    scanf("%f", &celsius);
    kelvin = celsius + 273.15;
    printf("Temperature in Kelvin: %f\n", kelvin);
    return 0;
}