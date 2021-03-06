<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="onCancel"
      title="新增"
      width="700px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" @click="() => onCancel()">取消</el-button>
            <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</el-button>
        </template>

        <el-form :inline="true" :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">

            <el-form-item label="登录名" prop="loginName" >
                <el-input v-model="modelRef.loginName" placeholder="请输入登录名" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickName" >
                <el-input v-model="modelRef.nickName" placeholder="请输入昵称" />
            </el-form-item>

            <el-form-item label="手机号" prop="tel" >
                <el-input v-model="modelRef.tel" placeholder="请输入手机号" />
            </el-form-item>

          <el-form-item label="邮箱" prop="email" >
            <el-input v-model="modelRef.email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item label="是否启用" prop="email" >
            <el-switch
                v-model="modelRef.delFlag"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="停用">
            </el-switch>
          </el-form-item>

          <el-divider><i class="el-icon-mobile-phone"></i>选择角色</el-divider>

          <el-form-item label="角色">
            <el-transfer :titles="['待选角色', '已选角色']" v-model="modelRef.roleSets" :data="roles" />
          </el-form-item>

        </el-form>


    </el-dialog>
</template>
<script lang="ts">
import {defineComponent, onMounted, PropType, reactive, ref} from "vue";
import { useI18n } from "vue-i18n";
import { TableListItem } from "../data.d";
import { ElForm, ElMessage } from "element-plus";

interface CreateFormSetupData {
    modelRef: Omit<TableListItem, 'id'>;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;


}

export default defineComponent({
    name: 'CreateForm',
    props: {
      roles: {
        type: Object,
        required: true
      },
        visible: {
            type: Boolean,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        },
        onSubmitLoading: {
            type: Boolean,
            required: true
        },
        onSubmit: {
            type: Function as PropType<(values: Omit<TableListItem, 'id'>, resetFields: () => void) => void>,
            required: true
        }
    },
    components: {

    },
    setup(props): CreateFormSetupData {

        const { t } = useI18n();



        // 表单值
        const modelRef = reactive<Omit<TableListItem, 'id'>>({
          loginName: '',
          nickName: '',
          tel: '',
          email: ''
        });
        // 表单验证
        const rulesRef = reactive({
            loginName: [
                  {
                      required: true,
                      validator: async (rule: any, value: string) => {
                          if (value === '' || !value) {
                              throw new Error('请输入名称');
                          } else if (value.length > 15) {
                              throw new Error('长度不能大于15个字');
                          }
                      }
                  },
              ],
            nickName: [
              {
                required: true,
                validator: async (rule: any, value: string) => {
                  if (value === '' || !value) {
                    throw new Error('请输入昵称');
                  } else if (value.length > 15) {
                    throw new Error('长度不能大于15个字');
                  }
                }
              },
            ],
            tel: [
                {
                    required: true,
                    validator: async (rule: any, value: string) => {
                        if (value === '' || !value) {
                            throw new Error('请输入手机号');
                        } else if (!/^1\d{10}$/.test(value)) {
                            throw new Error('请输入正确的手机号');
                        }
                    },
                },
            ],
            email: [
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ]
        });
        // form
        const formRef = ref<typeof ElForm>();
        // 重置
        const resetFields = () => {
            formRef.value?.resetFields();
        }
        // 提交
        const onFinish = async () => {
            try {
                const valid: boolean | undefined =  await formRef.value?.validate();
                if(valid === true) {
                    props.onSubmit(modelRef, resetFields);
                }
            } catch (error) {
                // console.log('error', error);
                ElMessage.warning(t('app.global.form.validatefields.catch'));
            }
        };
        return {
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            onFinish
        }

    }
})
</script>
