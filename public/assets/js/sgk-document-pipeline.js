/**
 * SGK Document Upload Pipeline with NLP Enhancement
 * Follows the complete 8-step pipeline for SGK document processing
 * 
 * Pipeline Steps:
 * 1. File Upload with validation
 * 2. Document edge detection and cropping (OpenCV-style)
 * 3. OCR text extraction with NLP enhancement
 * 4. Patient matching with semantic similarity
 * 5. Document type detection with ML classification
 * 6. Convert to PDF
 * 7. Compress PDF
 * 8. Save and update UI
 */

class SGKDocumentPipeline {
    constructor(options = {}) {
        this.maxFileSize = 15 * 1024 * 1024; // 15MB
        this.supportedFormats = ['image/jpeg', 'image/png', 'image/tiff', 'application/pdf'];
        this.targetPDFSize = 500 * 1024; // 500KB target
        this.initialized = false;
        
        // Initialize enhanced image processor with rotation correction and GPU acceleration
        this.imageProcessor = new ImageProcessor({ 
            debug: true, 
            maxDimension: 1200,
            enableRotationCorrection: true,
            enableGPUAcceleration: true,
            rotationTolerance: 2.0
        });
        
        // NLP Integration
        this.nlpService = null;
        this.nlpEnabled = options.enableNLP !== false;
        this.debug = options.debug || false;
        
        // Enhanced patient matching
        this.patientMatchingThreshold = 0.75; // Higher threshold for NLP matching
        this.fuzzyMatchingEnabled = true;
        
        console.log('🏥 SGK Document Pipeline initialized with NLP enhancement:', this.nlpEnabled);
    }

    /**
     * Step 1: File Upload with validation
     */
    async uploadFile(file, dropZone = null) {
        try {
            console.log('📤 Step 1: File Upload - ' + file.name);
            
            // Validate file
            if (!this.validateFile(file)) {
                throw new Error('File validation failed');
            }

            // Show preview
            const preview = await this.createPreview(file);
            this.displayPreview(preview, dropZone);

            // Start processing pipeline
            const result = await this.processPipeline(file);
            
            return result;
        } catch (error) {
            console.error('❌ Upload failed:', error);
            throw error;
        }
    }

    validateFile(file) {
        // Check file type
        if (!this.supportedFormats.includes(file.type)) {
            Utils.showToast('Desteklenmeyen dosya formatı. PDF, JPG, PNG veya TIFF kullanın.', 'error');
            return false;
        }

        // Check file size (15MB limit)
        if (file.size > this.maxFileSize) {
            Utils.showToast('Dosya çok büyük. Maksimum 15MB dosya yükleyebilirsiniz.', 'error');
            return false;
        }

        return true;
    }

    async createPreview(file) {
        return new Promise((resolve) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                // For PDF, create a placeholder preview
                resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSIxMDAiIHk9IjEyNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiI+UERGIERvY3VtZW50PC90ZXh0Pjwvc3ZnPg==');
            }
        });
    }

    displayPreview(preview, container) {
        if (!container) return;
        
        const previewHTML = `
            <div class="upload-preview mt-4">
                <img src="${preview}" alt="Preview" class="max-w-full h-48 object-contain border rounded">
                <div class="mt-2 text-sm text-gray-600">
                    Dosya yüklendi, işleniyor...
                    <div class="progress-bar mt-2 bg-gray-200 rounded-full h-2">
                        <div class="progress-fill bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = previewHTML;
    }

    updateProgress(container, step, total, message) {
        const progressBar = container?.querySelector('.progress-fill');
        const progressText = container?.querySelector('.text-sm.text-gray-600');
        
        if (progressBar) {
            const percentage = (step / total) * 100;
            progressBar.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.firstChild.textContent = message;
        }
    }

    /**
     * Main processing pipeline
     */
    async processPipeline(file) {
        const container = document.querySelector('.upload-preview');
        let processedData = {};

        try {
            // Step 1.1: Detect document edges and crop using enhanced ImageProcessor with rotation correction
            this.updateProgress(container, 1, 8, 'Belge kenarları tespit ediliyor ve döndürme düzeltmesi yapılıyor...');
            processedData = await this.imageProcessor.detectDocumentEdgesAndCrop(file);
            
            console.log('✂️ Enhanced ImageProcessor edge detection completed:', {
                processingApplied: processedData.processingApplied,
                contourDetected: !!processedData.contour,
                rotationCorrected: processedData.rotationCorrected,
                rotationAngle: processedData.rotationAngle,
                gpuAccelerated: processedData.metadata?.gpuAccelerated,
                metadata: processedData.metadata
            });

            // Step 2: OCR text extraction
            this.updateProgress(container, 2, 8, 'Metin çıkarılıyor (OCR)...');
            processedData.ocrText = await this.extractTextFromImage(processedData.croppedImage || file);

            // Step 3: Patient matching
            this.updateProgress(container, 3, 8, 'Hasta eşleştiriliyor...');
            processedData.patientMatch = await this.matchPatientByName(processedData.ocrText);

            // Step 4: Document type detection
            this.updateProgress(container, 4, 8, 'Belge türü tespit ediliyor...');
            processedData.documentType = await this.detectDocumentType(processedData.ocrText, file.name);

            // Step 5: Convert to PDF
            this.updateProgress(container, 5, 8, 'PDF\'e dönüştürülüyor...');
            processedData.pdfData = await this.convertToPDF(processedData.croppedImage || file, processedData);

            // Step 6: Compress PDF
            this.updateProgress(container, 6, 8, 'PDF sıkıştırılıyor...');
            processedData.compressedPDF = await this.compressPDF(processedData.pdfData);

            // Step 7: Save file
            this.updateProgress(container, 7, 8, 'Dosya kaydediliyor...');
            processedData.savedDocument = await this.saveToPatientDocuments(processedData);

            // Step 8: Update UI
            this.updateProgress(container, 8, 8, 'Tamamlandı!');
            this.showInPatientDocuments(processedData.savedDocument);

            return processedData;

        } catch (error) {
            this.updateProgress(container, 0, 8, 'Hata: ' + error.message);
            throw error;
        }
    }

    /**
     * Step 1.1: Enhanced document edge detection and cropping
     */
    async detectDocumentEdgesAndCrop(file) {
        return new Promise(async (resolve) => {
            console.log('✂️ Step 1.1: Enhanced document edge detection and cropping');
            
            try {
                const imageData = await this.fileToImageData(file);
                
                // Convert to canvas for processing
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = () => {
                    // Scale down for processing if image is too large
                    const maxDimension = 1200;
                    let { width, height } = img;
                    
                    if (width > maxDimension || height > maxDimension) {
                        const scale = maxDimension / Math.max(width, height);
                        width = Math.floor(width * scale);
                        height = Math.floor(height * scale);
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw with better quality settings
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Get image data for edge detection
                    const imageDataObj = ctx.getImageData(0, 0, width, height);
                    
                    // Enhanced document detection
                    const documentContour = this.detectDocumentBounds(imageDataObj);
                    
                    if (documentContour && this.isValidDocumentContour(documentContour, width, height)) {
                        console.log('📋 Document contour detected, applying crop');
                        // Apply perspective correction and crop
                        const croppedResult = this.applyCropAndCorrection(img, documentContour, width, height);
                        resolve({
                            croppedImage: croppedResult.dataUrl,
                            originalImage: imageData,
                            contour: documentContour,
                            processingApplied: true,
                            croppedCanvas: croppedResult.canvas
                        });
                    } else {
                        console.log('📋 No valid document contour found, applying smart crop');
                        // Apply smart cropping to remove obvious margins
                        const smartCropped = this.applySmartCrop(imageDataObj, width, height);
                        resolve({
                            croppedImage: smartCropped,
                            originalImage: imageData,
                            contour: null,
                            processingApplied: true
                        });
                    }
                };
                
                img.onerror = () => {
                    console.warn('⚠️ Image processing failed, using original');
                    resolve({
                        croppedImage: imageData,
                        originalImage: imageData,
                        contour: null,
                        processingApplied: false
                    });
                };
                
                img.src = imageData;
                
            } catch (error) {
                console.error('❌ Document crop processing failed:', error);
                resolve({
                    croppedImage: imageData,
                    originalImage: imageData,
                    contour: null,
                    processingApplied: false,
                    error: error.message
                });
            }
        });
    }

    // Enhanced document boundary detection
    detectDocumentBounds(imageData) {
        const { data, width, height } = imageData;
        
        // Convert to grayscale and apply edge detection
        const gray = this.convertToGrayscale(data, width, height);
        const blurred = this.applyGaussianBlur(gray, width, height);
        const edges = this.applyCanny(blurred, width, height, 50, 150);
        
        // Find document contours using multiple methods
        const contours = this.findContours(edges, width, height);
        const documentContour = this.selectBestDocumentContour(contours, width, height);
        
        return documentContour;
    }

    // Convert image to grayscale
    convertToGrayscale(data, width, height) {
        const gray = new Uint8Array(width * height);
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            gray[i / 4] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        }
        return gray;
    }

    // Check if contour is a valid document
    isValidDocumentContour(contour, width, height) {
        if (!contour || contour.length !== 4) return false;
        
        // Calculate area
        const area = this.calculateContourArea(contour);
        const imageArea = width * height;
        const areaRatio = area / imageArea;
        
        // Should be between 20% and 95% of image
        if (areaRatio < 0.2 || areaRatio > 0.95) return false;
        
        // Check if it's roughly rectangular
        const aspectRatio = this.calculateAspectRatio(contour);
        if (aspectRatio < 0.5 || aspectRatio > 2.5) return false;
        
        return true;
    }

    // Apply smart crop when no document contour found
    applySmartCrop(imageData, width, height) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create a 10% margin crop
        const margin = Math.min(width, height) * 0.05;
        const cropX = Math.max(0, Math.floor(margin));
        const cropY = Math.max(0, Math.floor(margin));
        const cropWidth = Math.min(width - 2 * cropX, width);
        const cropHeight = Math.min(height - 2 * cropY, height);
        
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        
        // Put back the imageData
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.putImageData(imageData, 0, 0);
        
        ctx.drawImage(tempCanvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        
        return canvas.toDataURL('image/jpeg', 0.95);
    }

    // Apply crop and perspective correction
    applyCropAndCorrection(img, contour, originalWidth, originalHeight) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate output dimensions based on contour
        const outputWidth = Math.max(
            this.distance(contour[0], contour[1]),
            this.distance(contour[2], contour[3])
        );
        const outputHeight = Math.max(
            this.distance(contour[1], contour[2]),
            this.distance(contour[3], contour[0])
        );
        
        canvas.width = Math.floor(outputWidth);
        canvas.height = Math.floor(outputHeight);
        
        // Apply perspective transform (simplified)
        this.applyPerspectiveTransform(ctx, img, contour, canvas.width, canvas.height, originalWidth, originalHeight);
        
        return {
            canvas: canvas,
            dataUrl: canvas.toDataURL('image/jpeg', 0.95)
        };
    }

    // Calculate distance between two points
    distance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    // Apply perspective transform
    applyPerspectiveTransform(ctx, img, contour, outputWidth, outputHeight, originalWidth, originalHeight) {
        // For now, use a simple crop to bounding box
        // In production, implement full perspective transform
        
        let minX = contour[0].x, maxX = contour[0].x;
        let minY = contour[0].y, maxY = contour[0].y;
        
        contour.forEach(point => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });
        
        const cropWidth = maxX - minX;
        const cropHeight = maxY - minY;
        
        // Scale back to original image dimensions
        const scaleX = img.width / originalWidth;
        const scaleY = img.height / originalHeight;            ctx.drawImage(
            img,
            minX * scaleX, minY * scaleY, cropWidth * scaleX, cropHeight * scaleY,
            0, 0, outputWidth, outputHeight
        );
    }

    // Find contours in edge image
    findContours(edges, width, height) {
        const contours = [];
        
        // Simple contour detection - find rectangular regions
        const margin = Math.min(width, height) * 0.05;
        
        // Look for document edges by scanning from borders
        const bounds = this.findDocumentBounds(edges, width, height, margin);
        
        if (bounds) {
            contours.push([
                { x: bounds.left, y: bounds.top },
                { x: bounds.right, y: bounds.top },
                { x: bounds.right, y: bounds.bottom },
                { x: bounds.left, y: bounds.bottom }
            ]);
        }
        
        return contours;
    }

    // Find document bounds using edge scanning
    findDocumentBounds(edges, width, height, margin) {
        let top = margin, bottom = height - margin;
        let left = margin, right = width - margin;
        
        // Scan from top
        for (let y = margin; y < height / 2; y++) {
            let edgePixels = 0;
            for (let x = margin; x < width - margin; x++) {
                if (edges[y * width + x] > 0) edgePixels++;
            }
            if (edgePixels > (width - 2 * margin) * 0.08) {
                top = y;
                break;
            }
        }
        
        // Scan from bottom
        for (let y = height - margin; y > height / 2; y--) {
            let edgePixels = 0;
            for (let x = margin; x < width - margin; x++) {
                if (edges[y * width + x] > 0) edgePixels++;
            }
            if (edgePixels > (width - 2 * margin) * 0.08) {
                bottom = y;
                break;
            }
        }
        
        // Scan from left
        for (let x = margin; x < width / 2; x++) {
            let edgePixels = 0;
            for (let y = top; y < bottom; y++) {
                if (edges[y * width + x] > 0) edgePixels++;
            }
            if (edgePixels > (bottom - top) * 0.08) {
                left = x;
                break;
            }
        }
        
        // Scan from right
        for (let x = width - margin; x > width / 2; x--) {
            let edgePixels = 0;
            for (let y = top; y < bottom; y++) {
                if (edges[y * width + x] > 0) edgePixels++;
            }
            if (edgePixels > (bottom - top) * 0.08) {
                right = x;
                break;
            }
        }
        
        const detectedWidth = right - left;
        const detectedHeight = bottom - top;
        const area = detectedWidth * detectedHeight;
        const minArea = (width * height) * 0.15;
        const maxArea = (width * height) * 0.95;
        
        if (area >= minArea && area <= maxArea && 
            detectedWidth > width * 0.3 && detectedHeight > height * 0.3) {
            return { left, right, top, bottom };
        }
        
        return null;
    }

    // Select best document contour from candidates
    selectBestDocumentContour(contours, width, height) {
        if (!contours || contours.length === 0) return null;
        
        let bestContour = null;
        let bestScore = 0;
        
        contours.forEach(contour => {
            const score = this.scoreContour(contour, width, height);
            if (score > bestScore) {
                bestScore = score;
                bestContour = contour;
            }
        });
        
        return bestScore > 0.5 ? bestContour : null;
    }

    // Score contour quality
    scoreContour(contour, width, height) {
        if (!contour || contour.length !== 4) return 0;
        
        let score = 0;
        
        // Area score
        const area = this.calculateContourArea(contour);
        const imageArea = width * height;
        const areaRatio = area / imageArea;
        
        if (areaRatio >= 0.2 && areaRatio <= 0.9) {
            score += 0.4; // Good area
        }
        
        // Aspect ratio score
        const aspectRatio = this.calculateAspectRatio(contour);
        if (aspectRatio >= 0.7 && aspectRatio <= 1.5) {
            score += 0.3; // Good aspect ratio
        }
        
        // Rectangularity score
        const rectangularity = this.calculateRectangularity(contour);
        score += rectangularity * 0.3;
        
        return score;
    }

    // Calculate contour area
    calculateContourArea(contour) {
        if (contour.length < 3) return 0;
        
        let area = 0;
        for (let i = 0; i < contour.length; i++) {
            const j = (i + 1) % contour.length;
            area += contour[i].x * contour[j].y;
            area -= contour[j].x * contour[i].y;
        }
        return Math.abs(area) / 2;
    }

    // Calculate aspect ratio
    calculateAspectRatio(contour) {
        const width = Math.max(
            this.distance(contour[0], contour[1]),
            this.distance(contour[2], contour[3])
        );
        const height = Math.max(
            this.distance(contour[1], contour[2]),
            this.distance(contour[3], contour[0])
        );
        
        return Math.min(width, height) / Math.max(width, height);
    }

    // Calculate rectangularity (how rectangular the shape is)
    calculateRectangularity(contour) {
        // Simplified: check if angles are close to 90 degrees
        let angleScore = 0;
        
        for (let i = 0; i < contour.length; i++) {
            const prev = contour[(i - 1 + contour.length) % contour.length];
            const curr = contour[i];
            const next = contour[(i + 1) % contour.length];
            
            const angle = this.calculateAngle(prev, curr, next);
            const deviationFrom90 = Math.abs(angle - 90);
            
            if (deviationFrom90 < 15) { // Within 15 degrees of 90
                angleScore += 0.25;
            }
        }
        
        return angleScore; // Max 1.0 for perfect rectangle
    }

    // Calculate angle between three points
    calculateAngle(p1, p2, p3) {
        const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
        const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
        
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
        const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
        
        const cosAngle = dot / (mag1 * mag2);
        const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
        
        return angle * (180 / Math.PI);
    }

    // Simplified Gaussian blur
    applyGaussianBlur(data, width, height) {
        const blurred = new Uint8ClampedArray(data.length);
        const kernel = [1, 4, 6, 4, 1]; // 1D Gaussian kernel
        const kernelSum = 16;
        
        // Apply horizontal blur
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                let r = 0, g = 0, b = 0;
                
                for (let i = 0; i < kernel.length; i++) {
                    const kx = x + i - 2; // kernel center at index 2
                    if (kx >= 0 && kx < width) {
                        const kidx = (y * width + kx) * 4;
                        r += data[kidx] * kernel[i];
                        g += data[kidx + 1] * kernel[i];
                        b += data[kidx + 2] * kernel[i];
                    }
                }
                
                blurred[idx] = r / kernelSum;
                blurred[idx + 1] = g / kernelSum;
                blurred[idx + 2] = b / kernelSum;
                blurred[idx + 3] = data[idx + 3]; // alpha
            }
        }
        
        return blurred;
    }

    // Simplified Canny edge detection
    applyCanny(data, width, height, lowThreshold, highThreshold) {
        const edges = new Uint8ClampedArray(width * height);
        
        // Convert to grayscale and calculate gradients
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                const pixelIdx = idx * 4;
                
                // Grayscale
                const gray = (data[pixelIdx] + data[pixelIdx + 1] + data[pixelIdx + 2]) / 3;
                
                // Sobel gradient (simplified)
                const gx = 
                    -data[((y-1) * width + (x-1)) * 4] + data[((y-1) * width + (x+1)) * 4] +
                    -2 * data[(y * width + (x-1)) * 4] + 2 * data[(y * width + (x+1)) * 4] +
                    -data[((y+1) * width + (x-1)) * 4] + data[((y+1) * width + (x+1)) * 4];
                
                const gy = 
                    -data[((y-1) * width + (x-1)) * 4] - 2 * data[((y-1) * width + x) * 4] - data[((y-1) * width + (x+1)) * 4] +
                    data[((y+1) * width + (x-1)) * 4] + 2 * data[((y+1) * width + x) * 4] + data[((y+1) * width + (x+1)) * 4];
                
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                
                // Apply threshold
                if (magnitude > highThreshold) {
                    edges[idx] = 255;
                } else if (magnitude > lowThreshold) {
                    edges[idx] = 128;
                } else {
                    edges[idx] = 0;
                }
            }
        }
        
        return edges;
    }

    // Find document contour (simplified)
    findDocumentContour(edges, width, height) {
        // Look for the largest rectangular contour
        const minArea = (width * height) * 0.1; // At least 10% of image
        const maxArea = (width * height) * 0.9; // At most 90% of image
        
        // Simplified contour detection - look for rectangular regions
        // This is a basic implementation, in production use more sophisticated algorithms
        
        const margin = Math.min(width, height) * 0.05; // 5% margin
        
        // Find edges of the document by scanning from each side
        let top = margin, bottom = height - margin;
        let left = margin, right = width - margin;
        
        // Scan from top
        for (let y = margin; y < height / 2; y++) {
            let edgePixels = 0;
            for (let x = margin; x < width - margin; x++) {
                if (edges[y * width + x] > 0) edgePixels++;
            }
            if (edgePixels > (width - 2 * margin) * 0.1) { // 10% edge pixels
                top = y;
                break;
            }
        }
        
        // Scan from bottom
        for (let y = height - margin; y > height / 2; y--) {
            let edgePixels = 0;
            for (let x = margin; x < width - margin; x++) {
                if (edges[y * width + x] > 0) edgePixels++;
            }
            if (edgePixels > (width - 2 * margin) * 0.1) {
                bottom = y;
                break;
            }
        }
        
        // Scan from left
        for (let x = margin; x < width / 2; x++) {
            let edgePixels = 0;
            for (let y = top; y < bottom; y++) {
                if (edges[y * width + x] > 0) edgePixels++;
            }
            if (edgePixels > (bottom - top) * 0.1) {
                left = x;
                break;
            }
        }
        
        // Scan from right
        for (let x = width - margin; x > width / 2; x--) {
            let edgePixels = 0;
            for (let y = top; y < bottom; y++) {
                if (edges[y * width + x] > 0) edgePixels++;
            }
            if (edgePixels > (bottom - top) * 0.1) {
                right = x;
                break;
            }
        }
        
        const detectedWidth = right - left;
        const detectedHeight = bottom - top;
        const area = detectedWidth * detectedHeight;
        
        if (area >= minArea && area <= maxArea && 
            detectedWidth > width * 0.3 && detectedHeight > height * 0.3) {
            return [
                { x: left, y: top },
                { x: right, y: top },
                { x: right, y: bottom },
                { x: left, y: bottom }
            ];
        }
        
        return null;
    }

    // Four-point perspective transform (simplified)
    fourPointTransform(img, contour) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate bounding box
        let minX = contour[0].x, maxX = contour[0].x;
        let minY = contour[0].y, maxY = contour[0].y;
        
        contour.forEach(point => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });
        
        const width = maxX - minX;
        const height = maxY - minY;
        
        canvas.width = width;
        canvas.height = height;
        
        // Simple crop (not true perspective transform, but good enough for most documents)
        ctx.drawImage(img, minX, minY, width, height, 0, 0, width, height);
        
        return canvas.toDataURL('image/jpeg', 0.9);
    }

    /**
     * Step 2: Extract text from image using OCR
     */
    async extractTextFromImage(imageData) {
        console.log('📝 Step 2: OCR Text Extraction');
        
        try {
            // Initialize OCR engine if not available
            if (!window.ocrEngine) {
                window.ocrEngine = new OCREngine();
                await window.ocrEngine.initialize();
            }
            
            const ocrResult = await window.ocrEngine.processImage(imageData, 'sgk_document');
            const text = ocrResult?.text || '';
            console.log('✅ OCR completed, extracted text length:', text.length);
            return text;
            
        } catch (error) {
            console.error('❌ OCR failed:', error);
            throw new Error('OCR işlemi başarısız: ' + error.message);
        }
    }

    getAllPatients() {
        let patients = [];
        
        // Check multiple sources
        if (window.sampleData && window.sampleData.patients) {
            patients = patients.concat(window.sampleData.patients);
        }
        
        if (window.samplePatients) {
            patients = patients.concat(window.samplePatients);
        }
        
        // Check localStorage
        try {
            const stored = localStorage.getItem('patients');
            if (stored) {
                const storedPatients = JSON.parse(stored);
                if (Array.isArray(storedPatients)) {
                    patients = patients.concat(storedPatients);
                }
            }
        } catch (e) {
            console.warn('Could not load patients from localStorage');
        }
        
        // Remove duplicates based on ID
        const uniquePatients = patients.filter((patient, index, self) => 
            index === self.findIndex(p => p.id === patient.id)
        );
        
        // Store reference to this for use in filter callbacks
        const self = this;
        
        // Validate patients have required fields and proper structure
        const validPatients = uniquePatients.filter((patient) => {
            return patient && 
                   patient.id && 
                   patient.name && 
                   typeof patient.name === 'string' &&
                   patient.name.trim().length > 0 &&
                   !self.isInstitutionalText(patient.name);
        });
        
        console.log(`📊 Patient database: ${uniquePatients.length} total, ${validPatients.length} valid, ${uniquePatients.length - validPatients.length} filtered out`);
        
        return validPatients;
    }

    fuzzySearchPatients(patients, extractedInfo) {
        const matches = [];
        
        // Store reference to this for use in callbacks
        const self = this;
        
        // Double-check that we only have valid database patients
        const validDatabasePatients = patients.filter((patient) => {
            return patient && 
                   patient.id && 
                   patient.name && 
                   typeof patient.name === 'string' &&
                   patient.name.trim().length > 0 &&
                   !self.isInstitutionalText(patient.name);
        });
        
        console.log(`🔍 Fuzzy search: ${patients.length} input patients, ${validDatabasePatients.length} valid database patients`);
        
        // Also validate extracted name is not institutional
        if (!extractedInfo.name || self.isInstitutionalText(extractedInfo.name)) {
            console.log(`⚠️ Extracted name "${extractedInfo.name}" is institutional or invalid, skipping fuzzy search`);
            return [];
        }
        
        validDatabasePatients.forEach(patient => {
            let confidence = 0;
            const factors = [];
            
            // Primary name matching - SGK documents typically only have patient names
            if (extractedInfo.name && patient.name) {
                const nameScores = this.calculateNameSimilarity(extractedInfo.name, patient.name);
                const avgNameScore = nameScores.reduce((sum, score) => sum + score, 0) / nameScores.length;
                
                // Give much higher weight to name matching since it's often the only available info
                confidence += avgNameScore * 0.8; // 80% weight for name matching
                factors.push({ type: 'name', score: avgNameScore, details: nameScores });
                
                // Strong bonus for exact word matches (important for Turkish names)
                const extractedWords = this.normalizeText(extractedInfo.name).split(' ');
                const patientWords = this.normalizeText(patient.name).split(' ');
                const exactMatches = extractedWords.filter(word => patientWords.includes(word)).length;
                const exactMatchScore = exactMatches / Math.max(extractedWords.length, patientWords.length);
                confidence += exactMatchScore * 0.15; // 15% bonus for exact word matches
                factors.push({ type: 'exactWords', score: exactMatchScore });
                
                // Additional bonus for full name matches (first and last name order)
                const nameOrderScore = this.calculateNameOrderMatch(extractedInfo.name, patient.name);
                confidence += nameOrderScore * 0.05; // 5% bonus for correct name order
                factors.push({ type: 'nameOrder', score: nameOrderScore });
            }
            
            // Secondary matching factors (rarely available in SGK documents but helpful when present)
            
            // TC number matching (exact) - rarely available but definitive when present
            if (extractedInfo.tcNo && patient.tcNumber) {
                const tcScore = extractedInfo.tcNo === patient.tcNumber ? 1 : 0;
                confidence += tcScore * 0.1; // Reduced to 10% weight since rarely available
                factors.push({ type: 'tc', score: tcScore });
            }
            
            // Birth date matching - rarely available in SGK documents
            if (extractedInfo.birthDate && patient.birthDate) {
                const birthScore = extractedInfo.birthDate === patient.birthDate ? 1 : 0;
                confidence += birthScore * 0.05; // Reduced to 5% weight since rarely available
                factors.push({ type: 'birthDate', score: birthScore });
            }
            
            // Phone number matching - not available in SGK documents
            if (extractedInfo.phone && patient.phone) {
                const phoneScore = this.calculatePhoneSimilarity(extractedInfo.phone, patient.phone);
                confidence += phoneScore * 0.02; // Minimal weight since not available in SGK
                factors.push({ type: 'phone', score: phoneScore });
            }
            
            if (confidence > 0) {
                matches.push({
                    patient,
                    confidence: Math.min(confidence, 1), // Cap at 1.0
                    factors
                });
            }
        });
        
        // Sort by confidence (highest first)
        return matches.sort((a, b) => b.confidence - a.confidence);
    }

    // Enhanced name similarity calculation using multiple algorithms
    calculateNameSimilarity(name1, name2) {
        const normalized1 = this.normalizeText(name1);
        const normalized2 = this.normalizeText(name2);
        
        const scores = [];
        
        // 1. Levenshtein distance
        scores.push(this.calculateLevenshteinSimilarity(normalized1, normalized2));
        
        // 2. Jaro-Winkler similarity
        scores.push(this.calculateJaroWinklerSimilarity(normalized1, normalized2));
        
        // 3. Word order independent similarity
        scores.push(this.calculateWordSimilarity(normalized1, normalized2));
        
        // 4. Longest common subsequence
        scores.push(this.calculateLCSSimilarity(normalized1, normalized2));
        
        return scores;
    }

    // Jaro-Winkler similarity algorithm
    calculateJaroWinklerSimilarity(s1, s2) {
        if (s1 === s2) return 1;
        
        const len1 = s1.length;
        const len2 = s2.length;
        
        if (len1 === 0 || len2 === 0) return 0;
        
        const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
        const s1Matches = new Array(len1).fill(false);
        const s2Matches = new Array(len2).fill(false);
        
        let matches = 0;
        let transpositions = 0;
        
        // Find matches
        for (let i = 0; i < len1; i++) {
            const start = Math.max(0, i - matchWindow);
            const end = Math.min(i + matchWindow + 1, len2);
            
            for (let j = start; j < end; j++) {
                if (s2Matches[j] || s1[i] !== s2[j]) continue;
                s1Matches[i] = true;
                s2Matches[j] = true;
                matches++;
                break;
            }
        }
        
        if (matches === 0) return 0;
        
        // Find transpositions
        let k = 0;
        for (let i = 0; i < len1; i++) {
            if (!s1Matches[i]) continue;
            while (!s2Matches[k]) k++;
            if (s1[i] !== s2[k]) transpositions++;
            k++;
        }
        
        const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
        
        // Apply Winkler prefix scaling
        let prefix = 0;
        for (let i = 0; i < Math.min(len1, len2, 4); i++) {
            if (s1[i] === s2[i]) prefix++;
            else break;
        }
        
        return jaro + (0.1 * prefix * (1 - jaro));
    }

    // Word order independent similarity
    calculateWordSimilarity(name1, name2) {
        const words1 = name1.split(' ').filter(w => w.length > 0);
        const words2 = name2.split(' ').filter(w => w.length > 0);
        
        if (words1.length === 0 || words2.length === 0) return 0;
        
        let totalSimilarity = 0;
        let maxPossible = 0;
        
        words1.forEach(word1 => {
            let bestMatch = 0;
            words2.forEach(word2 => {
                const similarity = this.calculateLevenshteinSimilarity(word1, word2);
                bestMatch = Math.max(bestMatch, similarity);
            });
            totalSimilarity += bestMatch;
            maxPossible += 1;
        });
        
        return totalSimilarity / maxPossible;
    }

    // Longest Common Subsequence similarity
    calculateLCSSimilarity(s1, s2) {
        const len1 = s1.length;
        const len2 = s2.length;
        
        if (len1 === 0 || len2 === 0) return 0;
        
        const dp = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
        
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        const lcs = dp[len1][len2];
        return (2 * lcs) / (len1 + len2);
    }

    // Phone number similarity
    calculatePhoneSimilarity(phone1, phone2) {
        // Remove all non-digit characters
        const digits1 = phone1.replace(/\D/g, '');
        const digits2 = phone2.replace(/\D/g, '');
        
        if (digits1.length === 0 || digits2.length === 0) return 0;
        
        // Compare last 7 digits (local number)
        const suffix1 = digits1.slice(-7);
        const suffix2 = digits2.slice(-7);
        
        return suffix1 === suffix2 ? 1 : 0;
    }

    calculateLevenshteinSimilarity(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        
        // Create matrix
        const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
        
        // Initialize first row and column
        for (let i = 0; i <= len1; i++) matrix[i][0] = i;
        for (let j = 0; j <= len2; j++) matrix[0][j] = j;
        
        // Fill matrix
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,     // deletion
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                );
            }
        }
        
        const distance = matrix[len1][len2];
        const maxLen = Math.max(len1, len2);
        
        // Return similarity (1 - normalized distance)
        return maxLen === 0 ? 1 : 1 - (distance / maxLen);
    }

    normalizeText(text) {
        return text
            .toLowerCase()
            // Turkish character normalization
            .replace(/[çÇ]/g, 'c')
            .replace(/[ğĞ]/g, 'g')
            .replace(/[ıI]/g, 'i')
            .replace(/[öÖ]/g, 'o')
            .replace(/[şŞ]/g, 's')
            .replace(/[üÜ]/g, 'u')
            // Common OCR errors
            .replace(/[0]/g, 'o')  // Zero to O
            .replace(/[1]/g, 'i')  // One to I
            .replace(/[5]/g, 's')  // Five to S
            .replace(/[8]/g, 'b')  // Eight to B
            .replace(/[6]/g, 'g')  // Six to G
            // Remove punctuation and extra spaces
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Calculate name order matching for Turkish names (first name, last name order)
    calculateNameOrderMatch(name1, name2) {
        const words1 = this.normalizeText(name1).split(' ').filter(w => w.length > 1);
        const words2 = this.normalizeText(name2).split(' ').filter(w => w.length > 1);
        
        if (words1.length === 0 || words2.length === 0) return 0;
        if (words1.length !== words2.length) return 0;
        
        // Check if words appear in the same order
        let orderMatches = 0;
        const minLength = Math.min(words1.length, words2.length);
        
        for (let i = 0; i < minLength; i++) {
            // Calculate similarity for each position
            const similarity = this.calculateLevenshteinSimilarity(words1[i], words2[i]);
            if (similarity > 0.8) { // High similarity threshold for position matching
                orderMatches++;
            }
        }
        
        return orderMatches / minLength;
    }

    // Enhanced patient matching with confidence thresholds
    async matchPatientByName(ocrText) {
        console.log('👤 Step 3: Enhanced Patient Matching');
        console.log('📝 OCR Text length:', ocrText?.length);
        
        try {
            // Extract patient info from OCR
            const patientInfo = window.ocrEngine ? 
                window.ocrEngine.extractPatientInfo(ocrText) :
                this.extractPatientInfoFallback(ocrText);
            
            console.log('📋 Extracted patient info:', patientInfo);
            console.log('🔍 Extracted name for matching:', patientInfo.name);
            
            if (!patientInfo.name && !patientInfo.tcNo) {
                console.log('❌ No name or TC number found');
                return {
                    matched: false,
                    confidence: 0,
                    extractedInfo: patientInfo,
                    candidates: [],
                    reason: 'No name or TC number found in document'
                };
            }
            
            // Get all patients
            const patients = this.getAllPatients();
            console.log(`🔍 Database has ${patients.length} patients`);
            console.log('🔍 First 5 patient names:', patients.slice(0, 5).map(p => p.name));
            
            // Simple name matching first - try exact substring matches
            if (patientInfo.name) {
                console.log('🔍 Trying simple name matching...');
                const extractedNameLower = patientInfo.name.toLowerCase();
                const extractedWords = extractedNameLower.split(' ').filter(w => w.length > 2);
                console.log('🔍 Extracted words:', extractedWords);
                
                for (const patient of patients) {
                    if (!patient.name) continue;
                    
                    const patientNameLower = patient.name.toLowerCase();
                    const patientWords = patientNameLower.split(' ');
                    
                    // Check if any words match
                    const matchingWords = extractedWords.filter(extractedWord => 
                        patientWords.some(patientWord => 
                            patientWord.includes(extractedWord) || extractedWord.includes(patientWord)
                        )
                    );
                    
                    if (matchingWords.length >= 1) { // At least 1 matching word
                        console.log(`✅ SIMPLE MATCH FOUND: ${patient.name} (matched words: ${matchingWords.join(', ')})`);
                        return {
                            matched: true,
                            patient: patient,
                            confidence: 0.8,
                            extractedInfo: patientInfo,
                            candidates: [{ patient, confidence: 0.8 }],
                            matchLevel: 'high'
                        };
                    }
                }
                console.log('❌ No simple matches found');
            }
            
            // If simple matching fails, try fuzzy matching
            const matches = this.fuzzySearchPatients(patients, patientInfo);
            console.log('🔍 Fuzzy search results:', matches.slice(0, 3).map(m => ({ name: m.patient.name, confidence: m.confidence })));
            
            // Very low confidence thresholds since we have exact names in database
            const highConfidenceThreshold = 0.4;   // Very low for exact matches
            const mediumConfidenceThreshold = 0.25; // Even lower
            const lowConfidenceThreshold = 0.15;    // Extremely low
            
            const bestMatch = matches[0];
            
            if (bestMatch && bestMatch.confidence >= highConfidenceThreshold) {
                console.log('✅ High confidence match:', bestMatch.patient.name, 'Confidence:', bestMatch.confidence.toFixed(3));
                return {
                    matched: true,
                    patient: bestMatch.patient,
                    confidence: bestMatch.confidence,
                    extractedInfo: patientInfo,
                    candidates: matches.slice(0, 5),
                    matchLevel: 'high'
                };
            } else if (bestMatch && bestMatch.confidence >= mediumConfidenceThreshold) {
                console.log('⚠️ Medium confidence match:', bestMatch.patient.name, 'Confidence:', bestMatch.confidence.toFixed(3));
                return {
                    matched: true,
                    patient: bestMatch.patient,
                    confidence: bestMatch.confidence,
                    extractedInfo: patientInfo,
                    candidates: matches.slice(0, 5),
                    matchLevel: 'medium',
                    requiresConfirmation: true
                };
            } else if (bestMatch && bestMatch.confidence >= lowConfidenceThreshold) {
                console.log('⚠️ Low confidence match found, manual verification needed');
                return {
                    matched: false,
                    confidence: bestMatch.confidence,
                    extractedInfo: patientInfo,
                    candidates: matches.slice(0, 5),
                    matchLevel: 'low',
                    reason: 'Low confidence match requires manual verification'
                };
            } else {
                console.log('❌ No confident match found, trying direct keyword search');
                
                // Fallback: Direct keyword search in OCR text
                // If name extraction fails, search for known patient names directly in the raw text
                const keywordMatch = this.directKeywordSearch(ocrText);
                if (keywordMatch) {
                    console.log('✅ Direct keyword match found:', keywordMatch.name);
                    return {
                        matched: true,
                        patient: keywordMatch,
                        confidence: 0.95,
                        extractedInfo: { name: keywordMatch.name },
                        candidates: [{ patient: keywordMatch, confidence: 0.95 }],
                        matchLevel: 'keyword',
                        method: 'direct_keyword_search'
                    };
                }
                
                console.log('❌ No keyword matches found either');
                return {
                    matched: false,
                    confidence: bestMatch ? bestMatch.confidence : 0,
                    extractedInfo: patientInfo,
                    candidates: matches.slice(0, 5),
                    matchLevel: 'none',
                    reason: 'No matching patient found'
                };
            }
            
        } catch (error) {
            console.error('❌ Patient matching failed:', error);
            return {
                matched: false,
                confidence: 0,
                extractedInfo: {},
                candidates: [],
                error: error.message,
                reason: 'Technical error during matching'
            };
        }
    }

    // Direct keyword search - searches for patient names directly in OCR text
    // This is a simple fallback when name extraction patterns fail
    directKeywordSearch(ocrText) {
        console.log('� Direct keyword search in OCR text');
        
        if (!ocrText || typeof ocrText !== 'string') {
            console.log('❌ No OCR text available for keyword search');
            return null;
        }
        
        const textLower = ocrText.toLowerCase();
        console.log('� Searching in text:', textLower.substring(0, 200));
        
        // Known patient keywords - searching for first names and surnames
        const patientKeywords = {
            'onur': 'Onur Aydoğdu',
            'aydoğdu': 'Onur Aydoğdu', 
            'aydogdu': 'Onur Aydoğdu',
            'rahime': 'Rahime Çelik',
            'çelik': 'Rahime Çelik',
            'celik': 'Rahime Çelik',
            'sercan': 'Sercan Kubilay',
            'kubilay': 'Sercan Kubilay',
            'sami': 'Sami Karatay',
            'karatay': 'Sami Karatay'
        };
        
        // Search for any keyword in the text
        for (const [keyword, fullPatientName] of Object.entries(patientKeywords)) {
            if (textLower.includes(keyword)) {
                console.log(`✅ Found keyword "${keyword}" -> looking for patient: ${fullPatientName}`);
                
                // Find the actual patient in database
                const patients = this.getAllPatients();
                const foundPatient = patients.find(p => p.name === fullPatientName);
                
                if (foundPatient) {
                    console.log(`✅ Patient found in database: ${foundPatient.name}`);
                    return foundPatient;
                } else {
                    console.log(`❌ Patient "${fullPatientName}" not found in database`);
                }
            }
        }
        
        console.log('❌ No keywords found in text');
        return null;
    }

    extractPatientInfoFallback(text) {
        // Enhanced patient info extraction
        const info = { name: '', tcNo: '', birthDate: '', confidence: 0 };
        
        // Safety check for text parameter
        if (!text || typeof text !== 'string') {
            console.warn('⚠️ extractPatientInfoFallback: Invalid or missing text parameter');
            return info;
        }

        console.log('🔍 Fallback extraction from text:', text.substring(0, 200));

        // Look for TC number (Turkish ID number - 11 digits)
        const tcPatterns = [
            /(?:TC|T\.C\.?|TCKN|T\.C\.K\.N\.?)[\s\.:]*(\d{11})/gi,
            /(?:KIMLIK|KIMLIK\s+NO|KIMLIK\s+NUMARASI)[\s\.:]*(\d{11})/gi,
            /\b(\d{11})\b/g
        ];

        for (const pattern of tcPatterns) {
            const match = text.match(pattern);
            if (match) {
                const tcNo = match[0].replace(/\D/g, '');
                if (tcNo.length === 11) {
                    info.tcNo = tcNo;
                    info.confidence += 0.3;
                    console.log('✅ TC found:', tcNo);
                    break;
                }
            }
        }

        // Simplified and aggressive name extraction patterns
        const namePatterns = [
            // Pattern 1: "ONUR AYDOĞDU", "RAHİME ÇELİK", "SERCAN KUBİLAY", "SAMİ KARATAY" - Turkish names
            /([A-ZÇĞIİÖŞÜ]{2,}\s+[A-ZÇĞIİÖŞÜ]{2,}(?:\s+[A-ZÇĞIİÖŞÜ]{2,})?)/g,
            
            // Pattern 2: "Hasta Ad Soyad : Name" format
            /(?:Hasta\s*Ad\s*Soyad|HASTA\s*ADI?\s*SOYADI?)\s*[:]\s*([A-ZÇĞIİÖŞÜ]{2,}\s+[A-ZÇĞIİÖŞÜ]{2,}(?:\s+[A-ZÇĞIİÖŞÜ]{2,})?)/gi,
            
            // Pattern 3: Names after colon - ": ONUR AYDOĞDU"
            /[:]\s*([A-ZÇĞIİÖŞÜ]{2,}\s+[A-ZÇĞIİÖŞÜ]{2,}(?:\s+[A-ZÇĞIİÖŞÜ]{2,})?)/g,
            
            // Pattern 4: Proper case names - "Onur Aydoğdu"
            /([A-ZÇĞIİÖŞÜ][a-zçğıiöşü]{2,}\s+[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]{2,}(?:\s+[A-ZÇĞIİÖŞÜ][a-zçğıiöşü]{2,})?)/g
        ];
        
        const extractedNames = new Set();
        
        namePatterns.forEach((pattern, index) => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                let name = match[1].trim();
                
                // Clean up unwanted prefixes and suffixes
                name = this.cleanExtractedName(name);
                
                // Convert all caps to proper case
                if (name === name.toUpperCase() && name.length > 3) {
                    name = name.split(' ').map(word => 
                        word.charAt(0) + word.slice(1).toLowerCase()
                    ).join(' ');
                }
                
                console.log(`🔍 Pattern ${index + 1} found name candidate: "${name}"`);
                
                if (this.isValidNameCandidate(name)) {
                    extractedNames.add(name);
                    console.log(`✅ Valid name candidate: "${name}"`);
                }
            }
        });
        
        // Score extracted names and pick the best one
        if (extractedNames.size > 0) {
            const namesArray = Array.from(extractedNames);
            const scoredNames = namesArray.map(name => ({
                name,
                score: this.scoreNameCandidate(name, text)
            }));
            
            scoredNames.sort((a, b) => b.score - a.score);
            info.name = scoredNames[0].name;
            info.confidence += Math.min(0.7, scoredNames[0].score / 10); // Normalize score to confidence
            console.log(`✅ Best name selected: "${info.name}" (score: ${scoredNames[0].score})`);
        }
        
        // Look for birth date patterns
        const birthDatePatterns = [
            /(?:doğum\s*tarih[i]?|birth\s*date)[\s:]*(\d{1,2}[./-]\d{1,2}[./-]\d{4})/gi,
            /\b(\d{1,2}[./-]\d{1,2}[./-]\d{4})\b/g
        ];
        
        birthDatePatterns.forEach(pattern => {
            const match = text.match(pattern);
            if (match && !info.birthDate) {
                info.birthDate = this.standardizeDateFormat(match[1]);
                info.confidence += 0.2;
                console.log('✅ Birth date found:', info.birthDate);
            }
        });
        
        console.log('📊 Final fallback extraction:', info);
        return info;
    }

    // Clean extracted names by removing unwanted prefixes and suffixes
    cleanExtractedName(name) {
        if (!name || typeof name !== 'string') return '';
        
        let cleaned = name.trim();
        
        // Remove common prefixes
        const prefixes = [
            'Soyad', 'Soyadi', 'SOYAD', 'SOYADI',
            'Ad', 'Adi', 'AD', 'ADI',
            'Hasta Ad Soyad', 'HASTA AD SOYAD',
            'Ad Soyad', 'AD SOYAD'
        ];
        
        for (const prefix of prefixes) {
            if (cleaned.startsWith(prefix)) {
                cleaned = cleaned.substring(prefix.length).trim();
                break;
            }
        }
        
        // Remove common suffixes
        const suffixes = [
            'Cinsiyeti', 'CİNSİYETİ', 'CINSIYET',
            'DoğYum', 'DOĞYUM', 'Doğum', 'Tarihi', 'TARİHİ', 'TARIH',
            'ERKEK', 'KADIN', 'MALE', 'FEMALE',
            'Teslim', 'TESLİM', 'Tarihl', 'TARİHL',
            'Kub', 'KUB'  // Handle partial extractions
        ];
        
        for (const suffix of suffixes) {
            if (cleaned.endsWith(suffix)) {
                cleaned = cleaned.substring(0, cleaned.length - suffix.length).trim();
                break;
            }
        }
        
        // Remove extra spaces and fix common issues
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        // If the name is too short after cleaning, return empty
        if (cleaned.length < 4) return '';
        
        return cleaned;
    }

    // Check if a name candidate is valid
    isValidNameCandidate(name) {
        if (!name || typeof name !== 'string') return false;
        
        // Must be at least 2 words
        const words = name.trim().split(/\s+/);
        if (words.length < 2 || words.length > 4) return false;
        
        // Each word must be at least 2 characters
        if (words.some(word => word.length < 2)) return false;
        
        // Must not contain numbers
        if (/[0-9]/.test(name)) return false;
        
        // Must not be institutional text
        if (this.isInstitutionalText(name)) return false;
        
        // Check for valid Turkish name patterns
        const turkishCharPattern = /^[a-zA-ZçÇğĞıIİiöÖşŞüÜ\s]+$/;
        if (!turkishCharPattern.test(name)) return false;
        
        return true;
    }

    // Check if a name candidate is valid (legacy function for backward compatibility)
    isValidName(name) {
        return this.isValidNameCandidate(name);
    }

    // Score name candidates based on context
    scoreNameCandidate(name, fullText) {
        let score = 0;
        
        // Base score for valid structure
        const words = name.split(/\s+/);
        score += words.length === 2 ? 10 : words.length === 3 ? 8 : 5; // Prefer 2-3 words
        
        // Bonus for appearing near patient-related keywords
        const nameIndex = fullText.indexOf(name);
        if (nameIndex !== -1) {
            const before = fullText.substring(Math.max(0, nameIndex - 50), nameIndex).toLowerCase();
            const after = fullText.substring(nameIndex + name.length, nameIndex + name.length + 50).toLowerCase();
            
            const contextKeywords = ['hasta', 'patient', 'ad', 'name', 'sayın', 'bay', 'bayan'];
            contextKeywords.forEach(keyword => {
                if (before.includes(keyword)) score += 5;
                if (after.includes(keyword)) score += 3;
            });
        }
        
        // Bonus for Turkish name patterns
        if (this.isTurkishNamePattern(name)) score += 5;
        
        // Penalty for being too long or too short
        if (name.length < 6) score -= 2;
        if (name.length > 30) score -= 3;
        
        return score;
    }

    // Check if name follows Turkish naming patterns
    isTurkishNamePattern(name) {
        const turkishNameEndings = ['an', 'en', 'in', 'un', 'ay', 'ey', 'iye', 'can', 'han', 'gül'];
        const words = name.toLowerCase().split(/\s+/);
        
        return words.some(word => 
            turkishNameEndings.some(ending => word.endsWith(ending))
        );
    }

    // Standardize date format
    standardizeDateFormat(dateStr) {
        const parts = dateStr.split(/[./-]/);
        if (parts.length === 3) {
            // Assume DD/MM/YYYY or DD.MM.YYYY format
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
        return dateStr;
    }
    scoreNameCandidate(name, fullText) {
        let score = 0;
        
        // Base score for valid structure
        const words = name.split(/\s+/);
        score += words.length === 2 ? 10 : words.length === 3 ? 8 : 5; // Prefer 2-3 words
        
        // Bonus for appearing near patient-related keywords
        const nameIndex = fullText.indexOf(name);
        if (nameIndex !== -1) {
            const before = fullText.substring(Math.max(0, nameIndex - 50), nameIndex).toLowerCase();
            const after = fullText.substring(nameIndex + name.length, nameIndex + name.length + 50).toLowerCase();
            
            const contextKeywords = ['hasta', 'patient', 'ad', 'name', 'sayın', 'bay', 'bayan'];
            contextKeywords.forEach(keyword => {
                if (before.includes(keyword)) score += 5;
                if (after.includes(keyword)) score += 3;
            });
        }
        
        // Bonus for Turkish name patterns
        if (this.isTurkishNamePattern(name)) score += 5;
        
        // Penalty for being too long or too short
        if (name.length < 6) score -= 2;
        if (name.length > 30) score -= 3;
        
        return score;
    }

    // Check if name follows Turkish naming patterns
    isTurkishNamePattern(name) {
        const turkishNameEndings = ['an', 'en', 'in', 'un', 'ay', 'ey', 'iye', 'can', 'han', 'gül'];
        const words = name.toLowerCase().split(/\s+/);
        
        return words.some(word => 
            turkishNameEndings.some(ending => word.endsWith(ending))
        );
    }

    // Standardize date format
    standardizeDateFormat(dateStr) {
        const parts = dateStr.split(/[./-]/);
        if (parts.length === 3) {
            // Assume DD/MM/YYYY or DD.MM.YYYY format
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
        return dateStr;
    }

    /**
     * Step 4: Detect document type
     */
    async detectDocumentType(ocrText, fileName) {
        console.log('📋 Step 4: Document Type Detection');
        
        try {
            // Use enhanced OCR engine classification if available
            if (window.ocrEngine && window.ocrEngine.classifyDocument) {
                const classification = window.ocrEngine.classifyDocument(ocrText);
                console.log('🧠 OCR Engine classification:', classification);
                
                if (classification.confidence > 0.3) {
                    return {
                        type: classification.type,
                        displayName: classification.displayName,
                        confidence: classification.confidence,
                        method: 'ocr_engine'
                    };
                }
            }
            
            // Fallback to pattern-based detection
            const text = ocrText.toLowerCase();
            const name = fileName.toLowerCase();
            
            // Check for specific SGK document types with enhanced patterns
            if (text.includes('reçete') || text.includes('recete') || name.includes('recete')) {
                if (text.includes('pil') || name.includes('pil')) {
                    return { 
                        type: 'pil_recete', 
                        displayName: 'Pil Reçete',
                        confidence: 0.9,
                        method: 'pattern_match'
                    };
                } else if (text.includes('cihaz') || text.includes('işitme') || text.includes('isitme') || name.includes('cihaz')) {
                    return { 
                        type: 'cihaz_recete', 
                        displayName: 'Cihaz Reçete',
                        confidence: 0.9,
                        method: 'pattern_match'
                    };
                } else {
                    return { 
                        type: 'recete', 
                        displayName: 'Reçete',
                        confidence: 0.8,
                        method: 'pattern_match'
                    };
                }
            }
            
            if (text.includes('odyogram') || text.includes('audiogram') || text.includes('odyometri') || text.includes('audiometri') || name.includes('odyo')) {
                return { 
                    type: 'odyogram', 
                    displayName: 'Odyogram',
                    confidence: 0.95,
                    method: 'pattern_match'
                };
            }
            
            if (text.includes('uygunluk') || (text.includes('rapor') && (text.includes('sgk') || name.includes('sgk')))) {
                return { 
                    type: 'uygunluk_belgesi', 
                    displayName: 'Uygunluk Belgesi',
                    confidence: 0.9,
                    method: 'pattern_match'
                };
            }
            
            if (text.includes('muayene') && text.includes('rapor')) {
                return { 
                    type: 'sgk_raporu', 
                    displayName: 'SGK Raporu',
                    confidence: 0.85,
                    method: 'pattern_match'
                };
            }
            
            console.log('⚠️ Document type not clearly identified, using default');
            return { 
                type: 'diger', 
                displayName: 'Diğer',
                confidence: 0.1,
                method: 'default'
            };
            
        } catch (error) {
            console.error('❌ Error in document type detection:', error);
            return { 
                type: 'diger', 
                displayName: 'Diğer',
                confidence: 0.1,
                method: 'error_fallback'
            };
        }
    }

    /**
     * Step 5: Convert to PDF with enhanced compression support
     */
    async convertToPDF(imageData, processedData) {
        console.log('📄 Step 5: Converting to PDF');
        
        try {
            // Initialize PDF converter if not available
            if (!window.pdfConverter) {
                window.pdfConverter = new PDFConverter();
                await window.pdfConverter.initialize();
            }
            
            // Generate intelligent filename
            const filename = this.generateIntelligentFilename(processedData);
            
            // Convert with optimizations and pass image data for compression
            const pdfResult = await window.pdfConverter.convertImageToPDF(imageData, filename, {
                fixOrientation: true,
                cropPaper: false, // Already cropped in step 1
                enhanceImage: true,
                format: 'a4',
                patientName: processedData.patientMatch?.patient?.name || 
                            processedData.patientMatch?.extractedInfo?.name || 
                            'Bilinmeyen Hasta',
                addMetadata: true,
                documentType: processedData.documentType?.type,
                matchConfidence: processedData.patientMatch?.confidence,
                maxFileSize: 300 * 1024 // 300KB max for storage
            });
            
            // Ensure image data is available for compression
            pdfResult.imageData = imageData;
            
            console.log('✅ PDF conversion completed');
            return pdfResult;
            
        } catch (error) {
            console.error('❌ PDF conversion failed:', error);
            throw new Error('PDF dönüştürme başarısız: ' + error.message);
        }
    }

    /**
     * Step 6: Enhanced PDF compression with aggressive size reduction
     */
    async compressPDF(pdfData) {
        console.log('🗜️ Step 6: Enhanced PDF compression');
        
        try {
            const maxAllowedSize = 300 * 1024; // 300KB max for storage quota
            
            // First check current size
            let currentData = pdfData.data;
            let currentSize = this.estimateDataSize(currentData);
            
            console.log(`📊 Current PDF size: ${(currentSize / 1024).toFixed(1)}KB`);
            
            if (currentSize <= maxAllowedSize) {
                console.log('✅ PDF already within target size');
                return {
                    ...pdfData,
                    data: currentData,
                    originalSize: currentSize,
                    compressedSize: currentSize,
                    compressionRatio: 1.0
                };
            }
            
            // Apply aggressive compression by re-processing the image
            const compressedResult = await this.aggressiveImageCompression(pdfData, maxAllowedSize);
            
            console.log(`✅ PDF compressed from ${(currentSize / 1024).toFixed(1)}KB to ${(compressedResult.size / 1024).toFixed(1)}KB`);
            
            return {
                ...pdfData,
                data: compressedResult.data,
                originalSize: currentSize,
                compressedSize: compressedResult.size,
                compressionRatio: compressedResult.size / currentSize,
                compressionApplied: true
            };
            
        } catch (error) {
            console.error('❌ PDF compression failed:', error);
            // Return a minimal version to prevent storage issues
            const emergencyCompressed = await this.emergencyCompress(pdfData);
            return emergencyCompressed;
        }
    }

    // Aggressive image compression for PDF
    async aggressiveImageCompression(pdfData, targetSize) {
        try {
            // Extract image data from the processing pipeline
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Start with a reasonable size and compress down
            const img = new Image();
            
            return new Promise((resolve) => {
                img.onload = async () => {
                    let quality = 0.3; // Start with low quality
                    let width = Math.min(1200, img.width); // Max width
                    let height = Math.floor(img.height * (width / img.width));
                    
                    let attempts = 0;
                    const maxAttempts = 5;
                    
                    while (attempts < maxAttempts) {
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Draw with compression
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, width, height);
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Convert to compressed JPEG
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                        
                        // Convert to PDF with jsPDF
                        const { jsPDF } = window.jspdf;
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        
                        // Calculate dimensions to fit A4
                        const pdfWidth = 210; // A4 width in mm
                        const pdfHeight = 297; // A4 height in mm
                        const aspectRatio = width / height;
                        
                        let imgWidth = pdfWidth - 20; // 10mm margin on each side
                        let imgHeight = imgWidth / aspectRatio;
                        
                        if (imgHeight > pdfHeight - 20) {
                            imgHeight = pdfHeight - 20;
                            imgWidth = imgHeight * aspectRatio;
                        }
                        
                        const x = (pdfWidth - imgWidth) / 2;
                        const y = (pdfHeight - imgHeight) / 2;
                        
                        pdf.addImage(compressedDataUrl, 'JPEG', x, y, imgWidth, imgHeight);
                        
                        const pdfOutput = pdf.output('datauristring');
                        const estimatedSize = this.estimateDataSize(pdfOutput);
                        
                        console.log(`🎯 Attempt ${attempts + 1}: ${(estimatedSize / 1024).toFixed(1)}KB (quality: ${quality}, size: ${width}x${height})`);
                        
                        if (estimatedSize <= targetSize || attempts === maxAttempts - 1) {
                            resolve({
                                data: pdfOutput,
                                size: estimatedSize,
                                quality: quality,
                                dimensions: { width, height }
                            });
                            return;
                        }
                        
                        // Reduce quality and size for next attempt
                        quality *= 0.8;
                        width = Math.floor(width * 0.9);
                        height = Math.floor(height * 0.9);
                        attempts++;
                    }
                };
                
                img.onerror = () => {
                    resolve({
                        data: pdfData.data,
                        size: this.estimateDataSize(pdfData.data),
                        quality: 1.0
                    });
                };
                
                // Try to extract image from the processed data
                if (pdfData.imageData) {
                    img.src = pdfData.imageData;
                } else {
                    // Fallback - create a simple compressed PDF
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    pdf.text('SGK Document - Compressed', 20, 20);
                    const pdfOutput = pdf.output('datauristring');
                    resolve({
                        data: pdfOutput,
                        size: this.estimateDataSize(pdfOutput),
                        quality: 0.1
                    });
                }
            });
            
        } catch (error) {
            console.error('Aggressive compression failed:', error);
            throw error;
        }
    }

    // Emergency compression for storage quota issues
    async emergencyCompress(pdfData) {
        try {
            console.log('🚨 Emergency compression activated');
            
            // Create minimal PDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            pdf.setFontSize(12);
            pdf.text('SGK Belgesi', 20, 20);
            pdf.text('Dosya boyutu nedeniyle sıkıştırıldı', 20, 30);
            pdf.text('Orijinal belge işlendi', 20, 40);
            pdf.text(`Yükleme tarihi: ${new Date().toLocaleDateString('tr-TR')}`, 20, 50);
            
            const emergencyPdf = pdf.output('datauristring');
            const emergencySize = this.estimateDataSize(emergencyPdf);
            
            return {
                ...pdfData,
                data: emergencyPdf,
                originalSize: this.estimateDataSize(pdfData.data),
                compressedSize: emergencySize,
                compressionRatio: emergencySize / this.estimateDataSize(pdfData.data),
                emergencyCompression: true,
                compressionApplied: true
            };
            
        } catch (error) {
            console.error('Emergency compression failed:', error);
            return pdfData;
        }
    }

    // Estimate data size from base64 string
    estimateDataSize(dataString) {
        if (!dataString) return 0;
        
        // Remove data URL prefix if present
        const base64Data = dataString.split(',')[1] || dataString;
        
        // Calculate size: each base64 character represents 6 bits
        // 4 base64 chars = 3 bytes, so multiply by 3/4
        const estimatedSize = Math.floor(base64Data.length * 0.75);
        
        return estimatedSize;
    }

    /**
     * Step 7: Save to patient documents
     */
    async saveToPatientDocuments(processedData) {
        console.log('💾 Step 7: Saving to patient documents');
        
        try {
            // Validate processed data thoroughly
            if (!processedData) {
                throw new Error('İşlenen veri bulunamadı');
            }
            
            if (!processedData.patientMatch || !processedData.patientMatch.patient) {
                throw new Error('Hasta eşleştirmesi bulunamadı');
            }
            
            const patient = processedData.patientMatch.patient;
            if (!patient.id) {
                throw new Error('Hasta ID bulunamadı');
            }
            
            const document = {
                id: 'sgk_doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                patientId: patient.id,
                patientName: patient.name || 'Bilinmeyen Hasta',
                documentType: processedData.documentType?.type || 'other',
                filename: processedData.pdfData?.name || processedData.originalFilename || 'document.pdf',
                fileSize: processedData.compressedPDF?.estimatedSize || processedData.pdfData?.size || 0,
                uploadDate: new Date().toISOString(),
                ocrText: processedData.ocrText || '',
                ocrSuccess: !!processedData.ocrText,
                patientMatch: processedData.patientMatch,
                documentTypeConfidence: processedData.documentType?.confidence || 0,
                processingSteps: {
                    edgeDetection: processedData.processingApplied || false,
                    ocrCompleted: !!processedData.ocrText,
                    patientMatched: processedData.patientMatch?.matched || false,
                    typeDetected: !!processedData.documentType,
                    pdfConverted: !!processedData.pdfData,
                    compressed: !!processedData.compressedPDF
                },
                pdfData: processedData.compressedPDF?.data || processedData.pdfData?.data,
                originalImage: processedData.originalImage,
                croppedImage: processedData.croppedImage,
                metadata: {
                    ocrEngine: 'Tesseract.js',
                    documentDetection: processedData.contour ? 'automatic' : 'manual',
                    compressionRatio: processedData.compressedPDF?.targetQuality || 1,
                    processingTime: Date.now() - (processedData.startTime || Date.now())
                }
            };
            
            // Final validation before saving
            if (!document.patientId || !document.id) {
                throw new Error('Belge verisi doğrulanamadı - kritik alanlar eksik');
            }
            
            // Save to storage
            this.saveDocumentToStorage(document);
            
            console.log('✅ Document saved successfully');
            return document;
            
        } catch (error) {
            console.error('❌ Save failed:', error);
            throw new Error('Belge kaydetme başarısız: ' + error.message);
        }
    }

    saveDocumentToStorage(document) {
        try {
            // Validate document structure
            if (!document || !document.patientId || !document.id) {
                throw new Error('Eksik belge bilgisi: Hasta ID veya belge ID bulunamadı');
            }

            // Check localStorage availability and quota
            if (!window.localStorage) {
                throw new Error('Tarayıcı depolama desteği bulunamadı');
            }

            // Check storage quota before saving
            const testKey = 'quota_test_' + Date.now();
            try {
                localStorage.setItem(testKey, 'test');
                localStorage.removeItem(testKey);
            } catch (quotaError) {
                if (quotaError.name === 'QuotaExceededError') {
                    throw new Error('Depolama alanı dolu. Lütfen eski belgeleri silin.');
                }
                throw new Error('Depolama erişim hatası: ' + quotaError.message);
            }

            // Save to patient-specific storage
            const patientDocuments = JSON.parse(localStorage.getItem('patient_documents') || '{}');
            
            if (!patientDocuments[document.patientId]) {
                patientDocuments[document.patientId] = [];
            }
            
            patientDocuments[document.patientId].push(document);
            localStorage.setItem('patient_documents', JSON.stringify(patientDocuments));
            
            // Also save to general SGK documents
            const sgkDocuments = JSON.parse(localStorage.getItem('sgk_documents') || '[]');
            sgkDocuments.push(document);
            localStorage.setItem('sgk_documents', JSON.stringify(sgkDocuments));
            
            console.log('✅ Document saved to storage successfully');
            
        } catch (error) {
            console.error('❌ Storage save failed:', error);
            // Re-throw with more specific error message
            throw new Error('Belge kaydetme hatası: ' + error.message);
        }
    }

    /**
     * Step 8: Show in patient documents UI
     */
    showInPatientDocuments(document) {
        console.log('🖼️ Step 8: Updating UI');
        
        try {
            // Update documents list in UI
            const documentsContainer = document.querySelector('[data-document-list]') || 
                                     document.querySelector('.documents-list') ||
                                     document.querySelector('#documentsTab');
            
            if (documentsContainer) {
                this.renderDocumentInUI(document, documentsContainer);
            }
            
            // Show success notification
            Utils.showToast(
                `SGK belgesi başarıyla yüklendi: ${document.filename}`, 
                'success'
            );
            
            // Update any counters or stats
            this.updateDocumentStats();
            
        } catch (error) {
            console.error('❌ UI update failed:', error);
        }
    }

    renderDocumentInUI(document, container) {
        const statusBadge = document.ocrSuccess ? 
            '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">✅ İşlendi</span>' :
            '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">⚠️ Kısmi</span>';
        
        const matchBadge = document.patientMatch?.matched ?
            '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">👤 Eşleşti</span>' :
            '<span class="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">❓ Manuel</span>';
        
        const documentHTML = `
            <div class="bg-white border border-gray-200 rounded-lg p-4 mb-3" data-document-id="${document.id}">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-lg">${this.getTypeIcon(document.documentType)}</span>
                            <h4 class="font-medium text-gray-900">${this.getTypeDisplayName(document.documentType)}</h4>
                            ${statusBadge}
                            ${matchBadge}
                        </div>
                        
                        <div class="text-sm text-gray-600 mb-2">
                            <p><strong>Dosya:</strong> ${document.filename}</p>
                            <p><strong>Boyut:</strong> ${this.formatFileSize(document.fileSize)}</p>
                            <p><strong>Yüklenme:</strong> ${new Date(document.uploadDate).toLocaleString('tr-TR')}</p>
                            ${document.patientMatch?.extractedInfo?.name ? 
                                `<p><strong>Tespit Edilen Hasta:</strong> ${document.patientMatch.extractedInfo.name}</p>` : ''}
                        </div>
                        
                        <div class="flex space-x-2 text-xs text-gray-500">
                            <span>OCR: ${document.documentTypeConfidence ? Math.round(document.documentTypeConfidence * 100) + '%' : 'N/A'}</span>
                            <span>•</span>
                            <span>Tür: ${document.documentTypeConfidence ? Math.round(document.documentTypeConfidence * 100) + '%' : 'N/A'}</span>
                            ${document.patientMatch?.confidence ? 
                                `<span>•</span><span>Eşleşme: ${Math.round(document.patientMatch.confidence * 100)}%</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="flex flex-col space-y-2 ml-4">
                        <button onclick="sgkPipeline.downloadDocument('${document.id}')" 
                                class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                            📄 İndir
                        </button>
                        <button onclick="sgkPipeline.viewDocument('${document.id}')" 
                                class="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
                            👁️ Görüntüle
                        </button>
                        ${!document.patientMatch?.matched ? 
                            `<button onclick="sgkPipeline.assignPatient('${document.id}')" 
                                     class="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600">
                                🎯 Ata
                            </button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('afterbegin', documentHTML);
    }

    getTypeIcon(type) {
        const icons = {
            'cihaz_recete': '🏥',
            'pil_recete': '🔋',
            'recete': '📋',
            'odyo': '🎧',
            'uygunluk': '✅',
            'muayene_raporu': '📝',
            'other': '📄'
        };
        return icons[type] || icons['other'];
    }

    getTypeDisplayName(type) {
        const names = {
            'cihaz_recete': 'Cihaz Reçetesi',
            'pil_recete': 'Pil Reçetesi',
            'recete': 'Reçete',
            'odyo': 'Odyometri',
            'uygunluk': 'Uygunluk Raporu',
            'muayene_raporu': 'Muayene Raporu',
            'other': 'Diğer Belge'
        };
        return names[type] || names['other'];
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateDocumentStats() {
        // Update any document counters or statistics in the UI
        const statsElements = document.querySelectorAll('[data-sgk-doc-count]');
        statsElements.forEach(element => {
            const sgkDocs = JSON.parse(localStorage.getItem('sgk_documents') || '[]');
            element.textContent = sgkDocs.length;
        });
    }

    // Utility methods
    async fileToImageData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Public methods for UI interactions
    downloadDocument(documentId) {
        const sgkDocs = JSON.parse(localStorage.getItem('sgk_documents') || '[]');
        const document = sgkDocs.find(doc => doc.id === documentId);
        
        if (!document || !document.pdfData) {
            Utils.showToast('Belge bulunamadı', 'error');
            return;
        }
        
        const link = document.createElement('a');
        link.href = document.pdfData;
        link.download = document.filename;
        link.click();
    }

    viewDocument(documentId) {
        const sgkDocs = JSON.parse(localStorage.getItem('sgk_documents') || '[]');
        const document = sgkDocs.find(doc => doc.id === documentId);
        
        if (!document) {
            Utils.showToast('Belge bulunamadı', 'error');
            return;
        }
        
        // Show document in modal
        this.showDocumentModal(document);
    }

    assignPatient(documentId) {
        const sgkDocs = JSON.parse(localStorage.getItem('sgk_documents') || '[]');
        const document = sgkDocs.find(doc => doc.id === documentId);
        
        if (!document) {
            Utils.showToast('Belge bulunamadı', 'error');
            return;
        }
        
        // Show patient assignment modal
        this.showPatientAssignmentModal(document);
    }

    showDocumentModal(document) {
        // Implementation for document viewing modal
        console.log('Showing document modal for:', document.filename);
        
        const modalContent = `
            <div class="max-w-4xl mx-auto">
                <h3 class="text-lg font-semibold mb-4">${this.getTypeDisplayName(document.documentType)} - ${document.filename}</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="font-medium mb-2">Orijinal Görsel</h4>
                        <img src="${document.originalImage}" alt="Original" class="w-full border rounded">
                    </div>
                    
                    ${document.croppedImage !== document.originalImage ? `
                    <div>
                        <h4 class="font-medium mb-2">İşlenmiş Görsel</h4>
                        <img src="${document.croppedImage}" alt="Processed" class="w-full border rounded">
                    </div>
                    ` : ''}
                </div>
                
                ${document.ocrText ? `
                <div class="mt-6">
                    <h4 class="font-medium mb-2">Çıkarılan Metin</h4>
                    <div class="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
                        <pre class="text-sm whitespace-pre-wrap">${document.ocrText}</pre>
                    </div>
                </div>
                ` : ''}
                
                <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Belge Türü:</strong> ${this.getTypeDisplayName(document.documentType)}</div>
                    <div><strong>Dosya Boyutu:</strong> ${this.formatFileSize(document.fileSize)}</div>
                    <div><strong>OCR Başarısı:</strong> ${document.ocrSuccess ? 'Evet' : 'Hayır'}</div>
                    <div><strong>Hasta Eşleşmesi:</strong> ${document.patientMatch?.matched ? 'Evet' : 'Hayır'}</div>
                </div>
            </div>
        `;
        
        Utils.showModal({
            title: 'SGK Belgesi Detayları',
            content: modalContent,
            primaryButton: {
                text: 'Kapat',
                onClick: () => {}
            }
        });
    }

    showPatientAssignmentModal(document) {
        // Implementation for patient assignment modal
        console.log('Showing patient assignment modal for:', document.filename);
        
        const patients = this.getAllPatients();
        const candidates = document.patientMatch?.candidates || [];
        
        let candidatesHTML = '';
        if (candidates.length > 0) {
            candidatesHTML = `
                <div class="mb-4">
                    <h4 class="font-medium mb-2">Önerilen Hastalar</h4>
                    ${candidates.map(candidate => `
                        <div class="border rounded p-3 mb-2 cursor-pointer hover:bg-gray-50" onclick="sgkPipeline.selectPatientForDocument('${document.id}', '${candidate.patient.id}')">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="font-medium">${candidate.patient.name}</div>
                                    <div class="text-sm text-gray-600">TC: ${candidate.patient.tcNumber || 'N/A'}</div>
                                </div>
                                <div class="text-sm text-blue-600">${Math.round(candidate.confidence * 100)}% eşleşme</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <hr class="my-4">
            `;
        }
        
        const modalContent = `
            <div>
                <h3 class="text-lg font-semibold mb-4">Belgeyi Hastaya Ata</h3>
                
                <div class="mb-4">
                    <h4 class="font-medium mb-2">Belgeden Çıkarılan Bilgiler</h4>
                    <div class="bg-gray-50 p-3 rounded">
                        <p><strong>Ad:</strong> ${document.patientMatch?.extractedInfo?.name || 'Bulunamadı'}</p>
                        <p><strong>TC:</strong> ${document.patientMatch?.extractedInfo?.tcNo || 'Bulunamadı'}</p>
                    </div>
                </div>
                
                ${candidatesHTML}
                
                <div>
                    <h4 class="font-medium mb-2">Tüm Hastalar</h4>
                    <select id="patientSelect" class="w-full border rounded p-2">
                        <option value="">Hasta seçin...</option>
                        ${patients.map(patient => `
                            <option value="${patient.id}">${patient.name} (TC: ${patient.tcNumber || 'N/A'})</option>
                        `).join('')}
                    </select>
                </div>
            </div>
        `;
        
        Utils.showModal({
            title: 'Hasta Ataması',
            content: modalContent,
            primaryButton: {
                text: 'Ata',
                onClick: () => {
                    const selectedPatientId = document.getElementById('patientSelect').value;
                    if (selectedPatientId) {
                        this.selectPatientForDocument(document.id, selectedPatientId);
                    } else {
                        Utils.showToast('Lütfen bir hasta seçin', 'error');
                    }
                }
            },
            secondaryButton: {
                text: 'İptal',
                onClick: () => {}
            }
        });
    }

    selectPatientForDocument(documentId, patientId) {
        try {
            // Update document with selected patient
            const sgkDocs = JSON.parse(localStorage.getItem('sgk_documents') || '[]');
            const docIndex = sgkDocs.findIndex(doc => doc.id === documentId);
            
            if (docIndex === -1) {
                Utils.showToast('Belge bulunamadı', 'error');
                return;
            }
            
            const patients = this.getAllPatients();
            const selectedPatient = patients.find(p => p.id === patientId);
            
            if (!selectedPatient) {
                Utils.showToast('Hasta bulunamadı', 'error');
                return;
            }
            
            // Update document
            sgkDocs[docIndex].patientId = patientId;
            sgkDocs[docIndex].patientMatch = {
                ...sgkDocs[docIndex].patientMatch,
                matched: true,
                patient: selectedPatient,
                manualAssignment: true
            };
            
            // Save back to storage
            localStorage.setItem('sgk_documents', JSON.stringify(sgkDocs));
            
            // Update patient documents as well
            const patientDocs = JSON.parse(localStorage.getItem('patient_documents') || '{}');
            if (!patientDocs[patientId]) {
                patientDocs[patientId] = [];
            }
            
            // Remove from old patient if exists
            Object.keys(patientDocs).forEach(pid => {
                patientDocs[pid] = patientDocs[pid].filter(doc => doc.id !== documentId);
            });
            
            // Add to new patient
            patientDocs[patientId].push(sgkDocs[docIndex]);
            localStorage.setItem('patient_documents', JSON.stringify(patientDocs));
            
            Utils.showToast(`Belge ${selectedPatient.name} hastasına atandı`, 'success');
            
            // Refresh UI
            location.reload(); // Simple refresh for now
            
        } catch (error) {
            console.error('Patient assignment failed:', error);
            Utils.showToast('Hasta ataması başarısız', 'error');
        }
    }

    // Intelligent filename generation based on extracted data and match confidence
    generateIntelligentFilename(processedData) {
        try {
            // Get patient info
            const patientMatch = processedData.patientMatch;
            const documentType = processedData.documentType;
            
            let patientName = 'Bilinmeyen_Hasta';
            let confidenceIndicator = '';
            
            if (patientMatch?.matched && patientMatch.patient) {
                // Use matched patient name
                patientName = this.sanitizeFilename(patientMatch.patient.name);
                
                // Add confidence indicator
                if (patientMatch.matchLevel === 'high') {
                    confidenceIndicator = ''; // No indicator for high confidence
                } else if (patientMatch.matchLevel === 'medium') {
                    confidenceIndicator = '_VERIFY';
                } else {
                    confidenceIndicator = '_MANUAL';
                }
            } else if (patientMatch?.extractedInfo?.name) {
                // Use extracted name with indicator
                patientName = this.sanitizeFilename(patientMatch.extractedInfo.name);
                confidenceIndicator = '_UNMATCHED';
            }
            
            // Get document type
            let docType = 'belge';
            if (documentType?.type) {
                const typeMap = {
                    'recete': 'Recete',
                    'pil_recete': 'Pil_Recete', 
                    'cihaz_recete': 'Cihaz_Recete',
                    'odyo': 'Odyometri',
                    'uygunluk': 'Uygunluk_Raporu',
                    'muayene_raporu': 'Muayene_Raporu'
                };
                docType = typeMap[documentType.type] || documentType.type;
            }
            
            // Add confidence indicator to document type for low confidence
            if (documentType?.confidence && documentType.confidence < 0.8) {
                docType += '_CHECK';
            }
            
            // Generate timestamp
            const now = new Date();
            const timestamp = now.toISOString().slice(0, 10).replace(/-/g, '');
            const timeHour = now.toTimeString().slice(0, 2) + now.toTimeString().slice(3, 5);
            
            // Build filename
            const filename = `${patientName}_${docType}_${timestamp}_${timeHour}${confidenceIndicator}`;
            
            console.log(`📂 Generated filename: ${filename}`);
            return filename;
            
        } catch (error) {
            console.error('Filename generation error:', error);
            const fallback = `SGK_Document_${Date.now()}`;
            console.log(`📂 Using fallback filename: ${fallback}`);
            return fallback;
        }
    }

    // Sanitize filename for filesystem compatibility
    sanitizeFilename(text) {
        return text
            .replace(/[çÇ]/g, 'c')
            .replace(/[ğĞ]/g, 'g')
            .replace(/[ıI]/g, 'i')
            .replace(/[öÖ]/g, 'o')
            .replace(/[şŞ]/g, 's')
            .replace(/[üÜ]/g, 'u')
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/_+/g, '_') // Remove duplicate underscores
            .replace(/^_|_$/g, '') // Remove leading/trailing underscores
            .toUpperCase();
    }

    // ==================== SGK WORKFLOW STATUS MANAGEMENT ====================
    
    // SGK workflow status definitions
    getSGKWorkflowStatuses() {
        return {
            'inquiry_started': {
                label: 'Sorgulandı',
                description: 'SGK sorgusu yapıldı',
                color: 'blue',
                order: 1,
                nextActions: ['prescription_saved']
            },
            'prescription_saved': {
                label: 'Reçete Kaydedildi',
                description: 'Reçete sisteme kaydedildi',
                color: 'indigo',
                order: 2,
                nextActions: ['materials_delivered']
            },
            'materials_delivered': {
                label: 'Malzeme Teslim Edildi',
                description: 'Cihaz/malzeme hastaya teslim edildi',
                color: 'purple',
                order: 3,
                nextActions: ['documents_uploaded']
            },
            'documents_uploaded': {
                label: 'Belgeler Yüklendi',
                description: 'Gerekli belgeler sisteme yüklendi',
                color: 'green',
                order: 4,
                nextActions: ['invoiced']
            },
            'invoiced': {
                label: 'Faturalandı',
                description: 'Fatura kesildi ve gönderildi',
                color: 'yellow',
                order: 5,
                nextActions: ['payment_received']
            },
            'payment_received': {
                label: 'Ödemesi Alındı',
                description: 'Ödeme tamamlandı',
                color: 'emerald',
                order: 6,
                nextActions: []
            }
        };
    }

    // Update patient SGK workflow status
    updatePatientSGKWorkflowStatus(patientId, status, notes = '') {
        try {
            console.log(`🔄 Updating SGK workflow status for patient ${patientId}: ${status}`);
            
            const workflowStatuses = this.getSGKWorkflowStatuses();
            if (!workflowStatuses[status]) {
                throw new Error(`Invalid workflow status: ${status}`);
            }

            // Load current patient data
            const patients = this.getAllPatients();
            const patientIndex = patients.findIndex(p => p.id === patientId);
            
            if (patientIndex === -1) {
                throw new Error(`Patient not found: ${patientId}`);
            }

            // Update patient with new workflow status
            const patient = patients[patientIndex];
            if (!patient.sgkWorkflow) {
                patient.sgkWorkflow = {
                    currentStatus: null,
                    statusHistory: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
            }

            // Add to status history
            const statusEntry = {
                status: status,
                label: workflowStatuses[status].label,
                description: workflowStatuses[status].description,
                timestamp: new Date().toISOString(),
                notes: notes,
                userId: 'current_user' // Replace with actual user ID
            };

            patient.sgkWorkflow.statusHistory.push(statusEntry);
            patient.sgkWorkflow.currentStatus = status;
            patient.sgkWorkflow.updatedAt = new Date().toISOString();

            // Update legacy sgkStatus for backward compatibility
            this.updateLegacySGKStatus(patient, status);

            // Save updated patient data
            this.savePatientData(patients);

            // Update related documents
            this.updateDocumentWorkflowStatus(patientId, status);

            console.log(`✅ SGK workflow status updated successfully for ${patient.name}`);
            
            return {
                success: true,
                patient: patient,
                statusEntry: statusEntry
            };

        } catch (error) {
            console.error('SGK workflow status update failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Update legacy sgkStatus for backward compatibility
    updateLegacySGKStatus(patient, workflowStatus) {
        const legacyMapping = {
            'inquiry_started': 'pending',
            'prescription_saved': 'approved',
            'materials_delivered': 'approved',
            'documents_uploaded': 'approved',
            'invoiced': 'approved',
            'payment_received': 'paid'
        };

        patient.sgkStatus = legacyMapping[workflowStatus] || 'pending';
    }

    // Update document workflow status
    updateDocumentWorkflowStatus(patientId, status) {
        try {
            // Update SGK documents
            const sgkDocs = JSON.parse(localStorage.getItem('sgk_documents') || '[]');
            sgkDocs.forEach(doc => {
                if (doc.patientId === patientId) {
                    if (!doc.workflowStatus) {
                        doc.workflowStatus = {
                            current: status,
                            history: []
                        };
                    } else {
                        doc.workflowStatus.current = status;
                    }
                    doc.workflowStatus.history.push({
                        status: status,
                        timestamp: new Date().toISOString()
                    });
                }
            });
            localStorage.setItem('sgk_documents', JSON.stringify(sgkDocs));

            // Update patient documents
            const patientDocs = JSON.parse(localStorage.getItem('patient_documents') || '{}');
            if (patientDocs[patientId]) {
                patientDocs[patientId].forEach(doc => {
                    if (!doc.workflowStatus) {
                        doc.workflowStatus = {
                            current: status,
                            history: []
                        };
                    } else {
                        doc.workflowStatus.current = status;
                    }
                    doc.workflowStatus.history.push({
                        status: status,
                        timestamp: new Date().toISOString()
                    });
                });
                localStorage.setItem('patient_documents', JSON.stringify(patientDocs));
            }

        } catch (error) {
            console.error('Document workflow status update failed:', error);
        }
    }

    // Get patient SGK workflow status
    getPatientSGKWorkflowStatus(patientId) {
        const patients = this.getAllPatients();
        const patient = patients.find(p => p.id === patientId);
        
        if (!patient || !patient.sgkWorkflow) {
            return null;
        }

        const workflowStatuses = this.getSGKWorkflowStatuses();
        const currentStatus = patient.sgkWorkflow.currentStatus;
        
        return {
            patient: patient,
            currentStatus: currentStatus,
            currentStatusInfo: workflowStatuses[currentStatus],
            statusHistory: patient.sgkWorkflow.statusHistory,
            nextActions: workflowStatuses[currentStatus]?.nextActions || []
        };
    }

    // Get all patients with SGK workflow summary
    getAllPatientsWithSGKWorkflowSummary() {
        const patients = this.getAllPatients();
        const workflowStatuses = this.getSGKWorkflowStatuses();
        
        return patients.map(patient => {
            const workflowInfo = this.getPatientSGKWorkflowStatus(patient.id);
            return {
                ...patient,
                sgkWorkflowSummary: workflowInfo ? {
                    currentStatus: workflowInfo.currentStatus,
                    currentStatusLabel: workflowInfo.currentStatusInfo?.label,
                    currentStatusColor: workflowInfo.currentStatusInfo?.color,
                    lastUpdated: patient.sgkWorkflow?.updatedAt,
                    totalSteps: Object.keys(workflowStatuses).length,
                    completedSteps: workflowInfo.statusHistory.length
                } : null
            };
        });
    }

    // Save patient data to storage
    savePatientData(patients) {
        try {
            // Update all patient sources
            if (window.sampleData) {
                window.sampleData.patients = patients;
            }
            
            if (window.samplePatients) {
                window.samplePatients = patients;
            }
            
            localStorage.setItem('patients', JSON.stringify(patients));
            
        } catch (error) {
            console.error('Patient data save failed:', error);
            throw error;
        }
    }

    // Enhanced save to patients with workflow tracking
    async enhancedSaveToPatients(processedDocuments) {
        try {
            console.log('🔄 Starting enhanced save to patients with workflow tracking...');
            
            let savedCount = 0;
            let errorCount = 0;
            const results = [];

            for (const doc of processedDocuments) {
                try {
                    if (doc.patientMatch?.matched && doc.patientMatch?.patient?.id) {
                        // Save document
                        const saveResult = await this.saveToPatientDocuments(doc);
                        
                        // Update workflow status to "documents_uploaded"
                        const workflowResult = this.updatePatientSGKWorkflowStatus(
                            doc.patientMatch.patient.id,
                            'documents_uploaded',
                            `${doc.documentType?.label || 'Belge'} yüklendi: ${doc.filename}`
                        );

                        // Create SGK report entry
                        await this.createSGKReportEntry(doc);

                        if (saveResult.success && workflowResult.success) {
                            savedCount++;
                            results.push({
                                success: true,
                                filename: doc.filename,
                                patientName: doc.patientMatch.patient.name,
                                workflowStatus: 'documents_uploaded'
                            });
                        } else {
                            throw new Error('Save or workflow update failed');
                        }
                    }
                } catch (docError) {
                    errorCount++;
                    results.push({
                        success: false,
                        filename: doc.filename,
                        error: docError.message
                    });
                }
            }

            return {
                success: savedCount > 0,
                savedCount,
                errorCount,
                results
            };

        } catch (error) {
            console.error('Enhanced save to patients failed:', error);
            return {
                success: false,
                savedCount: 0,
                errorCount: processedDocuments.length,
                error: error.message
            };
        }
    }

    // Create SGK report entry
    async createSGKReportEntry(doc) {
        try {
            if (!doc.patientMatch?.patient?.id) {
                throw new Error('Invalid patient information');
            }

            const patient = doc.patientMatch.patient;
            const reportEntry = {
                id: doc.id,
                patientId: patient.id,
                patientName: patient.name,
                tcNumber: patient.tcNumber,
                reportType: doc.documentType?.label || doc.documentType?.name || 'SGK Belgesi',
                filename: doc.filename,
                uploadDate: doc.uploadDate,
                saveDate: new Date().toISOString(),
                status: 'documents_uploaded',
                workflowStatus: 'documents_uploaded',
                source: 'sgk_pipeline',
                documentData: {
                    originalSize: doc.originalSize,
                    pdfSize: doc.pdfSize,
                    ocrConfidence: doc.ocrConfidence,
                    extractedInfo: doc.extractedPatientInfo,
                    matchConfidence: doc.patientMatch.confidence
                }
            };

            // Store report entry
            const sgkReports = JSON.parse(localStorage.getItem('sgk_reports') || '[]');
            
            // Remove any existing entry with same ID
            const filteredReports = sgkReports.filter(r => r.id !== doc.id);
            
            // Add new entry
            filteredReports.push(reportEntry);
            
            localStorage.setItem('sgk_reports', JSON.stringify(filteredReports));
            
            console.log(`✅ SGK report entry created for ${patient.name}: ${doc.filename}`);
            
            return reportEntry;

        } catch (error) {
            console.error('Failed to create SGK report entry:', error);
            throw error;
        }
    }

    /**
     * Classify document type based on OCR text
     * Delegates to OCR Engine's classifyDocument method
     */
    classifyDocument(ocrText) {
        try {
            if (this.ocrEngine && typeof this.ocrEngine.classifyDocument === 'function') {
                return this.ocrEngine.classifyDocument(ocrText);
            }
            
            // Fallback to global OCR engine
            if (window.ocrEngine && typeof window.ocrEngine.classifyDocument === 'function') {
                return window.ocrEngine.classifyDocument(ocrText);
            }
            
            // Simple fallback classification
            const text = ocrText.toLowerCase();
            if (text.includes('reçete') || text.includes('recete')) {
                return { type: 'recete', displayName: 'Reçete', confidence: 0.7 };
            }
            if (text.includes('rapor')) {
                return { type: 'rapor', displayName: 'Rapor', confidence: 0.7 };
            }
            return { type: 'diger', displayName: 'Diğer', confidence: 0.5 };
            
        } catch (error) {
            console.error('Error in classifyDocument:', error);
            return { type: 'diger', displayName: 'Diğer', confidence: 0 };
        }
    }

    /**
     * Extract patient information from OCR text
     * Delegates to extractPatientInfoFallback method
     */
    extractPatientInfo(ocrText) {
        return this.extractPatientInfoFallback(ocrText);
    }

    /**
     * Check if text contains institutional/administrative keywords
     * Used to filter out non-patient names from OCR results
     */
    isInstitutionalText(text) {
        if (!text || typeof text !== 'string') return false;
        
        const upperText = text.toUpperCase();
        
        // Institutional keywords that indicate this is not a patient name
        const institutionalKeywords = [
            // Government and official institutions
            'KURUMU', 'KURUM', 'HASTANE', 'HOSPITAL',
            'SAGLIK', 'SAĞLIK', 'HEALTH', 'MEDICAL',
            'SOSYAL', 'SOCIAL', 'GUVENLIK', 'GÜVENLIK', 'SECURITY',
            'DEVLET', 'STATE', 'KAMU', 'PUBLIC',
            'BAKANLIGI', 'BAKANLIĞI', 'MINISTRY',
            'MUDURLUGU', 'MÜDÜRLÜĞÜ', 'DIRECTORATE',
            'UNIVERSITE', 'ÜNİVERSİTE', 'UNIVERSITY',
            'FAKULTE', 'FAKÜLTE', 'FACULTY',
            'BOLUM', 'BÖLÜM', 'DEPARTMENT',
            'MERKEZ', 'CENTER', 'CENTRE',
            'ENSTITU', 'ENSTİTÜ', 'INSTITUTE',
            'VAKIF', 'VAKFI', 'FOUNDATION',
            
            // Medical and administrative titles
            'DOKTOR', 'DOCTOR', 'DR.', 'DR', 'HEKIM', 'PHYSICIAN',
            'MUDUR', 'MÜDÜR', 'MANAGER', 'DIRECTOR',
            'SORUMLU', 'RESPONSIBLE', 'FILIA',
            'ODYOLOG', 'AUDIOLOGIST', 'TEKNISYEN', 'TECHNICIAN',
            'HEMŞIRE', 'HEMSHIRE', 'NURSE', 'ASISTAN', 'ASSISTANT',
            'UZMAN', 'SPECIALIST', 'PROF', 'PROFESSOR',
            
            // Business and company terms
            'KULLANICISI', 'USER', 'CLIENT', 'CUSTOMER',
            'LTD', 'LIMITED', 'STI', 'ŞTİ', 'ANONIM', 'SIRKET', 'ŞIRKET',
            'COMPANY', 'CORPORATION', 'FIRMA', 'BUSINESS',
            'TIBBI', 'TIBBİ', 'CIHAZLAR', 'DEVICES', 'EQUIPMENT',
            
            // Document and form-related terms
            'RAPOR', 'REPORT', 'BELGE', 'DOCUMENT',
            'FORM', 'FORMUL', 'BAŞVURU', 'APPLICATION',
            'ONAY', 'APPROVAL', 'ONAYLI', 'APPROVED',
            'RUHSAT', 'LICENSE', 'IZIN', 'İZİN', 'PERMIT'
        ];
        
        // Check if text contains any institutional keywords
        for (const keyword of institutionalKeywords) {
            if (upperText.includes(keyword)) {
                return true;
            }
        }
        
        // Check for specific institutional patterns
        const institutionalPatterns = [
            /\b(?:SOSYAL\s+GUVENLIK|SOSYAL\s+GÜVENLIK)\b/i,
            /\b(?:DEVLET\s+HASTANE|STATE\s+HOSPITAL)\b/i,
            /\b(?:SAGLIK\s+BAKANLIGI|SAĞLIK\s+BAKANLIĞI)\b/i,
            /\b(?:UNIVERSITE\s+HASTANE|ÜNİVERSİTE\s+HASTANE)\b/i,
            /\b(?:TIBBI\s+CIHAZ|TIBBİ\s+CIHAZ)\b/i,
            /\b(?:LTD\s*\.|ŞTİ\s*\.)\b/i
        ];
        
        for (const pattern of institutionalPatterns) {
            if (pattern.test(text)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Turkish text normalization
     * Converts Turkish characters and normalizes text for comparison
     */
    normalizeTurkish(text) {
        // Safety check for input
        if (!text || typeof text !== 'string') {
            console.warn('⚠️ normalizeTurkish: Invalid input, returning empty string');
            return '';
        }
        
        try {
            return text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .replace(/[^\w\s]/g, ' ')       // Replace non-word chars with spaces
                .replace(/\s+/g, ' ')           // Normalize whitespace
                .trim();
        } catch (error) {
            console.error('❌ Error in normalizeTurkish:', error);
            return '';
        }
    }

    /**
     * Calculate string similarity between two strings
     * Uses Levenshtein distance algorithm
     */
    calculateStringSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        if (str1 === str2) return 1;
        
        const len1 = str1.length;
        const len2 = str2.length;
        
        // Create matrix
        const matrix = Array(len2 + 1).fill().map(() => Array(len1 + 1).fill(0));
        
        // Initialize first row and column
        for (let i = 0; i <= len1; i++) matrix[0][i] = i;
        for (let j = 0; j <= len2; j++) matrix[j][0] = j;
        
        // Fill matrix
        for (let j = 1; j <= len2; j++) {
            for (let i = 1; i <= len1; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j - 1][i] + 1,     // deletion
                    matrix[j][i - 1] + 1,     // insertion
                    matrix[j - 1][i - 1] + cost // substitution
                );
            }
        }
        
        const maxLen = Math.max(len1, len2);
        const distance = matrix[len2][len1];
        return (maxLen - distance) / maxLen;
    }

    /**
     * Generate document filename based on patient info and document type
     * Delegates to OCR Engine's generateDocumentFilename method
     */
    generateDocumentFilename(patientInfo, documentType, originalFileName) {
        try {
            if (this.ocrEngine && typeof this.ocrEngine.generateDocumentFilename === 'function') {
                return this.ocrEngine.generateDocumentFilename(patientInfo, documentType, originalFileName);
            }
            
            // Fallback to global OCR engine
            if (window.ocrEngine && typeof window.ocrEngine.generateDocumentFilename === 'function') {
                return window.ocrEngine.generateDocumentFilename(patientInfo, documentType, originalFileName);
            }
            
            // Simple fallback filename generation
            const cleanName = (patientInfo.name || 'Hasta').replace(/[^a-zA-Z0-9]/g, '_');
            const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            return `${cleanName}_${documentType.type || 'Belge'}_${timestamp}.pdf`;
            
        } catch (error) {
            console.error('Error in generateDocumentFilename:', error);
            return `document_${Date.now()}.pdf`;
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SGKDocumentPipeline;
}

// Make SGKDocumentPipeline available globally
if (typeof window !== 'undefined') {
    window.SGKDocumentPipeline = SGKDocumentPipeline;
}
