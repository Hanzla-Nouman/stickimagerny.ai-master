import * as fal from "@fal-ai/serverless-client";

export const callFalFoocus = async (
  prompt,
  style,
  height,
  width,
  guidance_scale,
  sharpness,
  numImages,
  negative_prompt,
  safety_checker,
  controlImageUrl
) => {
  return await fal.subscribe("fal-ai/fooocus", {
    input: {
      prompt: prompt,
      negative_prompt:
      negative_prompt,
      styles: [style],
      performance: "Extreme Speed",
      guidance_scale: guidance_scale,
      sharpness: sharpness,
      control_type: "ImagePrompt",
      control_image_weight: 1,
      control_image_stop_at: 1,
      aspect_ratio: height + "x" + width,
      num_images: numImages,
      control_image_url: controlImageUrl,
      control_type: "PyraCanny",
      enable_safety_checker: safety_checker,
      loras: [
        {
          path: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_offset_example-lora_1.0.safetensors",
          scale: 0.1,
        },
      ],
      seed: 176400,
      // other parameters...
    },
    pollInterval: 5000,
    logs: true,
    onQueueUpdate(update) {
      console.log("queue update", update);
    },
    // other options...
  });
};



export const callStableDiffusion3 = async (

  prompt,
  image_size,
  loras,
  guidance_scale,
  negative_prompt,
  num_images,
  safety_checker
) => {
  return await fal.subscribe("fal-ai/stable-diffusion-v3-medium", {
    input: {
        "prompt": prompt,
        "image_size": image_size,
      
        "guidance_scale": guidance_scale,
        "negative_prompt": negative_prompt,
        // "image_format": "jpeg",
        "num_images": num_images,
    
        "enable_safety_checker": safety_checker,
       
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        update.logs.map((log) => log.message).forEach(console.log);
      }
    },
  });
};


export const callFaceSwap = async (baseImageUrl, swapImageUrl) => {
  try {
    
    return await fal.subscribe("fal-ai/face-swap", {
      input: {
        base_image_url: baseImageUrl,
        swap_image_url: swapImageUrl
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
  } catch (error) {
    console.error('Error occurred in callFaceSwap: ', error);
  }
};

export const callCCSR = async (
  imageUrl,
  scale,
  tileDiffusion,
  tileDiffusionSize,
  tileDiffusionStride,
  tileVae,
  tileVaeDecoderSize,
  tileVaeEncoderSize,
  steps,
  tMax,
  tMin,
  colorFixType
) => {
  try {
    const result = await fal.subscribe("fal-ai/ccsr", {
      input: {
        image_url: imageUrl,
        scale: scale,
        tile_diffusion: tileDiffusion,
        tile_diffusion_size: tileDiffusionSize,
        tile_diffusion_stride: tileDiffusionStride,
        tile_vae: tileVae,
        tile_vae_decoder_size: tileVaeDecoderSize,
        tile_vae_encoder_size: tileVaeEncoderSize,
        steps: steps,
        t_max: tMax,
        t_min: tMin,
        color_fix_type: colorFixType
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result;
  } catch (error) {
    console.error('Error occurred in callCCSR: ', error);
  }
};


export const callFastAnimatedDiff = async (
  prompt,
  negativePrompt,
  numFrames,
  numInferenceSteps,
  guidanceScale,
  fps,
  videoSize
) => {
  try {
    const url = "https://fal.run/fal-ai/fast-animatediff/text-to-video";
    const headers = {
      "Authorization": `Key 54538d0a-a826-4086-9bbb-07bd6f3098cc:52cbd4ac9ab4f773c73ed1a84e8b4498`,
      "Content-Type": "application/json"
    };
    const body = JSON.stringify({
      "prompt": prompt,
      "negative_prompt": negativePrompt,
      "num_frames": numFrames,
      "num_inference_steps": numInferenceSteps,
      "guidance_scale": guidanceScale,
      "fps": fps,
      "video_size": videoSize
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error occurred in callFastAnimatedDiff: ', error);
  }
};

export const callFastSVD = async (imageUrl, motionBucketId, condAug, steps, fps) => {
  try {
    const result = await fal.subscribe("fal-ai/fast-svd", {
      input: {
        "image_url": imageUrl,
        "motion_bucket_id": motionBucketId,
        "cond_aug": condAug,
        "steps": steps,
        "deep_cache": "none",
        "fps": fps
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result;
  } catch (error) {
    console.error('Error occurred in subscribeFastSVD: ', error);
  }
};

export const callFastSVDLcmTextToVideo = async (prompt, motionBucketId, condAug, steps, fps, videoSize) => {
  try {
    const url = "https://fal.run/fal-ai/fast-svd-lcm/text-to-video";
    const headers = {
      "Authorization": `Key 54538d0a-a826-4086-9bbb-07bd6f3098cc:52cbd4ac9ab4f773c73ed1a84e8b4498`,
      "Content-Type": "application/json"
    };
    const body = JSON.stringify({
      "prompt": prompt,
      "motion_bucket_id": motionBucketId,
      "cond_aug": condAug,
      "steps": steps,
      "seed": 176400,
      "fps": fps,
      "video_size": videoSize
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error occurred in callFastSVDLcmTextToVideo: ', error);
  }
};


export async  function downloadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'image.jpg';  // Set to the desired file name
    link.click();
    URL.revokeObjectURL(blobUrl);
  }


  export function generateUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
