var NoiseGenerator = require('./NoiseGenerator');
var util = require('util');

function PerlinNoiseGenerator(random) {
    if (random) {
        this.random = random;
        this.offsetX = random.nextDouble() * 256;
        this.offsetY = random.nextDouble() * 256;
        this.offsetZ = random.nextDouble() * 256;

        for (var i = 0; i < 256; i++) {
            this.perm[i] = random.nextInt(256 - i) + i;
        }
        for (i = 0; i < 256; i++) {
            var pos = random.nextInt(256 - i) + i;
            var old = this.perm[i];

            this.perm[i] = this.perm[pos];
            this.perm[pos] = old;
            this.perm[i + 256] = this.perm[i];
        }
    } else {
        this.perm = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180, 151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
    }
}

PerlinNoiseGenerator.prototype.noise = function (x, y, z, frequency, amplitude, normalized) {
    if (frequency !== undefined || amplitude !== undefined || normalized !== undefined) {
        return PerlinNoiseGenerator.super_.prototype.noise.apply(this, arguments);
    }
    x += this.offsetX;
    y += this.offsetY;
    z += this.offsetZ;

    var floorX = Math.floor(x);
    var floorY = Math.floor(y);
    var floorZ = Math.floor(z);

    var X = floorX & 255;
    var Y = floorY & 255;
    var Z = floorZ & 255;

    x -= floorX;
    y -= floorY;
    z -= floorZ;

    var fX = NoiseGenerator.fade(x);
    var fY = NoiseGenerator.fade(y);
    var fZ = NoiseGenerator.fade(z);

    var A = this.perm[x] + Y;
    var AA = this.perm[A] + Z;
    var AB = this.perm[A + 1] + Z;
    var B = this.perm[X + 1] + Y;
    var BA = this.perm[B] + Z;
    var BB = this.perm[B + 1] + Z;

    return NoiseGenerator.lerp(fZ,
        NoiseGenerator.lerp(
            fY,
            NoiseGenerator.lerp(
                fX,
                NoiseGenerator.grad(this.perm[AA], x, y, z),
                NoiseGenerator.grad(this.perm[BA], x - 1, y, z)
            ),
            NoiseGenerator.lerp(
                fX,
                NoiseGenerator.grad(this.perm[AB], x, y - 1, z),
                NoiseGenerator.grad(this.perm[BB], x - 1, y - 1, z)
            )
        ),
        NoiseGenerator.lerp(
            fY,
            NoiseGenerator.lerp(
                fX,
                NoiseGenerator.grad(this.perm[AA + 1], x, y, z - 1),
                NoiseGenerator.grad(this.perm[BA + 1], x - 1, y, z - 1)
            ),
            NoiseGenerator.lerp(
                fX,
                NoiseGenerator.grad(this.perm[AB + 1], x, y - 1, z - 1),
                NoiseGenerator.grad(this.perm[BB + 1], x - 1, y - 1, z - 1)
            )
        )
    )
};

util.inherits(PerlinNoiseGenerator, NoiseGenerator);
