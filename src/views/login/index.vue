<template>
  <div class="login-container">
    <!-- 注册弹出页面 -->
    <div class="register-content">
      <!-- :before-close="handleClose" 关闭窗口提交表单方法 -->
      <el-drawer ref="drawer" :visible.sync="dialog" direction="ltr" custom-class="register-drawer" size="670px">
        <div class="register-drawer__content">
          <!-- 注册页面 参数设置 -->
          <el-form ref="registerForm" :model="registerForm" :rules="registerRules">
            <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickName">
              <el-input v-model="registerForm.nickName" autocomplete="off" placeholder="请输入昵称" />
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobilePhone">
              <el-input v-model="registerForm.mobilePhone" autocomplete="off" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="registerForm.email" autocomplete="off" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="登陆账号" :label-width="formLabelWidth" prop="loginName">
              <el-input v-model="registerForm.loginName" autocomplete="off" placeholder="请输入loginName" />
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
              <el-input v-model="registerForm.password" show-password autocomplete="off" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
              <el-radio v-model="registerForm.sex" label="0">未知</el-radio>
              <el-radio v-model="registerForm.sex" label="1">男</el-radio>
              <el-radio v-model="registerForm.sex" label="2">女</el-radio>
            </el-form-item>
          </el-form>
          <!-- 注册提交按钮 -->
          <div class="register-drawer__footer">
            <el-button size="medium" round @click="dialog = false">取 消</el-button>
            <el-button
              type="primary"
              :loading="loading"
              size="medium"
              round
              @click="$refs.drawer.closeDrawer()"
            >{{ loading ? '提交中 ...' : '注 册' }}</el-button>
          </div>
        </div>
      </el-drawer>
    </div>
    <!-- 登陆-布局页面 -->
    <el-row>
      <el-col :span="24">
        <div class="login-head-content bg-purple-dark">
          head-url
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="login-cover-content">
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="(item,index) in loginCoverImg" :key="index">
              <div>
                <img :src="item.url">
                <p class="comment">{{ index.comment }</p>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="login-content">
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            auto-complete="on"
            label-position="left"
          >
            <div class="title-container">
              <h3 class="title">登 陆</h3>
            </div>

            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名/手机号/邮箱"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                clearable
                maxlength="16"
                show-word-limit
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

            <el-button
              :loading="loading"
              type="primary"
              style="width:100%;margin-bottom:30px;"
              @click.native.prevent="loginSubmit"
            >登陆</el-button>

            <div class="tips">
              <span style="margin-right:1px;">忘记密码 ？</span>
              <el-button type="text" @click="dialog = true">新建用户</el-button>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { validUsername, validPassword, validMobile, validEmail } from "@/utils/validate";
import { login } from "@/api/user";
import { setToken } from "@/utils/auth";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      }
      if (!validUsername(value)) {
        callback(new Error("loginName(字母数字大小写)/手机号/邮箱 格式异常"));
      } else {
        callback();
      }
    };
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error("手机号不能为空"));
      }
      if (!validMobile(value)) {
        callback(new Error("手机号格式异常"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (!validEmail(value)) {
        callback(new Error("邮箱格式异常"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error("密码格式异常（需包含字母数字大小写,长度8～16）"));
      } else {
        callback();
      }
    };
    return {
      loginCoverImg: [{
          url: require('../../assets/login/cover/cover-1.jpeg'),
          comment: '图片描述'
        },{
          url: require('../../assets/login/cover/cover-2.jpeg'),
          comment: '图片描述'
        },{
          url: require('../../assets/login/cover/cover-3.jpeg'),
          comment: '图片描述'
        }
      ],
      loginForm: {
        username: "Admin123",
        password: "Admin123"
      },
      loginRules: {
        username: [{ required: true, trigger: "blur", validator: validateUsername }],
        password: [{ required: true, trigger: "blur", validator: validatePassword }]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      dialog: false,
      registerForm: {
        nickName: "",
        mobilePhone: "",
        email: "",
        loginName: "",
        password: "",                
        sex: '0'
      },
      registerRules: {
        mobilePhone: [{ required: true, trigger: "blur", validator: validateMobile }],
        email: [{ required: false, trigger: "blur", validator: validateEmail }],
        loginName: [{ required: true, trigger: "blur", validator: validateUsername }],
        password: [{ required: true, trigger: "blur", validator: validatePassword }]
      },
      formLabelWidth: "80px"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    // 密码是否可见，也就是将input 的类型设置在password 和非password 中转换
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    // 登陆表单提交方法
    loginSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // 执行登陆操作，调用face-permission 的login接口，获取返回的token，并且跳转到主页
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(res => {
              this.$router.push({ path: "/" });
              this.loading = false;
            })
            .catch(e => {
              console.log(e);
              this.loading = false;
            });
        } else {
          console.log("用户名和密码好像错了呢!!");
          return false;
        }
      });
    },
    // 注册方法
    handleClose(done) {
      this.$confirm("确定要提交表单吗？")
        .then(_ => {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            done();
          }, 2000);
        })
        .catch(_ => {});
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;


.login-head-content{
    height: 62px;
    overflow: hidden;
    zoom: 1;
    border-bottom: 1px solid #d6dfea;
    background: #eff4fa;
}
.login-cover-content{
    position: relative;
    width: 658px;
    height: 500px;
    margin: 175px -100px 0 auto;
}


.login-container {
  min-height: 100%;
  min-width: 1423px;
  background-color: $bg;
  overflow: hidden;
  // 页面loyout 布局 ，左右比例 14 ： 10
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
    .left-title{
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
    }
  }

  .register-content{
    border-radius: 4px;
    min-height: 36px;
    position: absolute;
  }
  //设置走马灯轮播图
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }


  // 登陆页面css样式设置
  .login-form {
    position: relative;
    width: 420px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto 0 150px;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

  // 注册页面css样式设置
  .register-drawer__content{
    margin: auto 12% auto 10%;
  }
  .register-drawer__footer{
    position: absolute;
    right: 18%;
  }


</style>
